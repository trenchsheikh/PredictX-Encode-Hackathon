/**
 * Concordium ID App SDK Service
 * Implements identity verification using the official Concordium ID App SDK
 * Based on: https://www.npmjs.com/package/@concordium/id-app-sdk
 */

import {
  ConcordiumIDAppSDK,
  type CreateAccountCreationRequestMessage,
  IDAppSdkWallectConnectMethods,
  type CreateAccountCreationResponse,
  type CreateAccountResponseMsgType,
  type SignedCredentialDeploymentTransaction,
  type RecoverAccountCreationRequestMessage,
  type RecoverAccountResponse,
  type RecoverAccountMsgType,
} from '@concordium/id-app-sdk';

/**
 * Initialize Concordium ID App SDK
 */
export function initializeConcordiumIDApp(): ConcordiumIDAppSDK {
  const sdk = new ConcordiumIDAppSDK({
    // Configuration for testnet or mainnet
    network: process.env.NEXT_PUBLIC_CONCORDIUM_NETWORK || 'testnet',
  });

  return sdk;
}

/**
 * Create account creation request
 * This initiates the identity verification flow with Concordium ID App
 */
export async function createAccountCreationRequest(
  walletAddress: string
): Promise<CreateAccountCreationRequestMessage> {
  const sdk = initializeConcordiumIDApp();

  // Create account creation request
  const request: CreateAccountCreationRequestMessage = {
    type: IDAppSdkWallectConnectMethods.CreateAccountCreation,
    payload: {
      walletAddress,
      // Request specific attributes from the user
      requestedAttributes: {
        // Required attributes for responsible gambling
        age: true,
        jurisdiction: true,
        // Optional attributes (can be added if needed)
        // firstName: false,
        // lastName: false,
      },
      minimumAge: parseInt(process.env.MINIMUM_AGE || '18'),
    },
  };

  return request;
}

/**
 * Handle account creation response
 * Process the response from Concordium ID App after user verification
 */
export async function handleAccountCreationResponse(
  response: CreateAccountCreationResponse
): Promise<{
  success: boolean;
  accountAddress?: string;
  credentials?: SignedCredentialDeploymentTransaction;
  attributes?: {
    age?: number;
    jurisdiction?: string;
  };
  error?: string;
}> {
  try {
    // Check response type
    if (response.type === 'error') {
      return {
        success: false,
        error: response.error || 'Identity verification failed',
      };
    }

    // Extract account credentials and attributes
    const { accountAddress, credentials, revealedAttributes } =
      response.payload;

    // Validate required attributes
    if (!revealedAttributes?.age || !revealedAttributes?.jurisdiction) {
      return {
        success: false,
        error: 'Required attributes (age, jurisdiction) not provided',
      };
    }

    // Validate age
    const minimumAge = parseInt(process.env.MINIMUM_AGE || '18');
    if (revealedAttributes.age < minimumAge) {
      return {
        success: false,
        error: `User must be at least ${minimumAge} years old`,
      };
    }

    // Validate jurisdiction
    const allowedJurisdictions = (
      process.env.ALLOWED_JURISDICTIONS || 'US,UK,CA,AU'
    ).split(',');

    if (!allowedJurisdictions.includes(revealedAttributes.jurisdiction)) {
      return {
        success: false,
        error: `Betting not allowed in jurisdiction: ${revealedAttributes.jurisdiction}`,
      };
    }

    return {
      success: true,
      accountAddress,
      credentials,
      attributes: {
        age: revealedAttributes.age,
        jurisdiction: revealedAttributes.jurisdiction,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error processing response',
    };
  }
}

/**
 * Create recover account request
 * For users who want to recover their Concordium account
 */
export async function createRecoverAccountRequest(
  seedPhrase: string
): Promise<RecoverAccountCreationRequestMessage> {
  const request: RecoverAccountCreationRequestMessage = {
    type: IDAppSdkWallectConnectMethods.RecoverAccountCreation,
    payload: {
      seedPhrase,
    },
  };

  return request;
}

/**
 * Handle recover account response
 */
export async function handleRecoverAccountResponse(
  response: RecoverAccountResponse
): Promise<{
  success: boolean;
  accountAddress?: string;
  error?: string;
}> {
  try {
    if (response.type === 'error') {
      return {
        success: false,
        error: response.error || 'Account recovery failed',
      };
    }

    return {
      success: true,
      accountAddress: response.payload.accountAddress,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error during recovery',
    };
  }
}

/**
 * Launch Concordium ID App for identity verification
 * This opens the Concordium Wallet/ID App for user to complete verification
 */
export function launchConcordiumIDApp(
  requestMessage: CreateAccountCreationRequestMessage
): Promise<boolean> {
  return new Promise(resolve => {
    const sdk = initializeConcordiumIDApp();

    // Encode request as URL parameter
    const encodedRequest = encodeURIComponent(JSON.stringify(requestMessage));

    // For development/testing: Check if we should use mock verification
    if (
      process.env.NEXT_PUBLIC_MOCK_CONCORDIUM === 'true' ||
      process.env.NODE_ENV === 'development'
    ) {
      console.log('Mock Concordium verification enabled');
      // In development, we'll trigger the mock response after a delay
      setTimeout(() => {
        // Create the full response structure expected by handleAccountCreationResponse
        // The response should match CreateAccountCreationResponse type
        const mockResponse: CreateAccountCreationResponse = {
          type: 'success' as CreateAccountResponseMsgType,
          payload: {
            accountAddress: 'mock_account_' + Date.now(),
            credentials: {
              credential: {
                type: 'normal',
                contents: {
                  credId: 'mock_cred_id',
                  ipIdentity: 0,
                  revocationThreshold: 1,
                  arData: {},
                  policy: {
                    validTo: new Date(
                      Date.now() + 365 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    createdAt: new Date().toISOString(),
                    revealedAttributes: {},
                  },
                },
              },
              signature: 'mock_signature',
            } as SignedCredentialDeploymentTransaction,
            revealedAttributes: {
              age: 25,
              jurisdiction: 'US',
            },
          },
        };

        console.log(
          'Mock Concordium: Dispatching verification response',
          mockResponse
        );

        // Dispatch message event to simulate app response
        // The listener expects event.data.payload to be the response itself (not stringified)
        window.postMessage(
          {
            type: 'concordium-id-app-success',
            payload: mockResponse, // Send as object, not stringified
          },
          '*'
        );

        resolve(true);
      }, 2000);
      return;
    }

    // Concordium ID App deep link
    const idAppUrl = `concordium-id://request?data=${encodedRequest}`;

    // Try to open ID App with better error handling
    const attemptLaunch = () => {
      try {
        // Create a hidden iframe to attempt the protocol handler
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = idAppUrl;
        document.body.appendChild(iframe);

        // Check if app opened after short delay
        setTimeout(() => {
          document.body.removeChild(iframe);

          // If we're still here, app probably didn't open
          // Try fallback to web version
          console.warn(
            'Concordium ID App may not be installed, trying web fallback'
          );
          const webUrl = `https://wallet.testnet.concordium.com/`;

          const newWindow = window.open(
            webUrl,
            '_blank',
            'noopener,noreferrer'
          );

          if (!newWindow) {
            console.error(
              'Failed to open Concordium web wallet - popup blocked'
            );
            resolve(false);
          } else {
            resolve(true);
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to launch Concordium ID App:', error);
        resolve(false);
      }
    };

    attemptLaunch();
  });
}

/**
 * Listen for ID App response
 * Set up listener for when user returns from Concordium ID App
 */
export function setupIDAppResponseListener(
  callback: (response: CreateAccountCreationResponse) => void
): () => void {
  const handleMessage = (event: MessageEvent) => {
    // Validate origin (in production, check against known Concordium domains)
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = ['https://id.concordium.com', 'concordium-id://'];
      // Add origin validation here
    }

    // Check if message is from Concordium ID App
    if (event.data?.type?.startsWith('concordium-id-app')) {
      try {
        console.log('Concordium: Received message', event.data);

        // Parse the payload
        let response: CreateAccountCreationResponse;

        if (typeof event.data.payload === 'string') {
          // Payload is stringified JSON
          response = JSON.parse(
            event.data.payload
          ) as CreateAccountCreationResponse;
        } else {
          // Payload is already an object (mock mode)
          response = event.data.payload as CreateAccountCreationResponse;
        }

        console.log('Concordium: Parsed response', response);
        console.log('Concordium: Response payload', response.payload);

        // Validate response structure
        if (!response) {
          console.error(
            'Concordium: Invalid response - response is null/undefined'
          );
          return;
        }

        if (!response.payload) {
          console.error(
            'Concordium: Invalid response structure - missing payload',
            response
          );
          return;
        }

        if (!response.payload.accountAddress) {
          console.error(
            'Concordium: Invalid response - missing accountAddress',
            response.payload
          );
          return;
        }

        callback(response);
      } catch (error) {
        console.error('Error parsing ID App response:', error, event.data);
      }
    }
  };

  // Add event listener
  window.addEventListener('message', handleMessage);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

/**
 * Verify Web3 ID credential
 * Verify the cryptographic signature of the Web3 ID credential
 */
export async function verifyWeb3IdCredential(
  credentials: SignedCredentialDeploymentTransaction
): Promise<boolean> {
  try {
    // TODO: Implement actual cryptographic verification
    // This should verify the signature against Concordium's public keys

    // For now, basic validation
    if (!credentials || !credentials.signature) {
      return false;
    }

    // In production, use Concordium SDK to verify:
    // const isValid = await concordiumClient.verifyCredential(credentials);

    return true;
  } catch (error) {
    console.error('Error verifying Web3 ID credential:', error);
    return false;
  }
}
