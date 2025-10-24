'use client';

import { useState, useEffect } from 'react';

import type { CreateAccountCreationResponse } from '@concordium/id-app-sdk';
import { usePrivy } from '@privy-io/react-auth';
import {
  Loader2,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createAccountCreationRequest,
  handleAccountCreationResponse,
  launchConcordiumIDApp,
  setupIDAppResponseListener,
} from '@/lib/concordium-id-service';

interface ConcordiumVerifyModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: (data: {
    idCommitment: string;
    accountAddress: string;
    attributes: {
      age: number;
      jurisdiction: string;
    };
  }) => void;
}

export function ConcordiumVerifyModalV2({
  open,
  onOpenChange,
  onVerified,
}: ConcordiumVerifyModalV2Props) {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    'intro' | 'launching' | 'waiting' | 'processing' | 'success'
  >('intro');

  useEffect(() => {
    if (!open) return;

    // Set up listener for ID App response
    const cleanup = setupIDAppResponseListener(
      async (response: CreateAccountCreationResponse) => {
        setStep('processing');

        // Handle the response from Concordium ID App
        const result = await handleAccountCreationResponse(response);

        if (!result.success) {
          setError(result.error || 'Identity verification failed');
          setStep('intro');
          setLoading(false);
          return;
        }

        // Get Solana wallet address (optional at this stage)
        const solanaAccount = user?.linkedAccounts.find(
          account => account.type === 'wallet' && account.chain === 'solana'
        );

        try {
          // If wallet is connected, link identity immediately
          // Otherwise, we'll link it later when wallet connects
          if (solanaAccount?.address && user?.id) {
            // Link identity to our backend
            const linkResponse = await fetch('/api/rg/link-identity', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                privyUserId: user.id,
                solanaPublicKey: solanaAccount.address,
                concordiumAccountAddress: result.accountAddress,
                concordiumAttributes: result.attributes,
              }),
            });

            const data = await linkResponse.json();

            if (!data.success) {
              throw new Error(data.error || 'Failed to link identity');
            }

            // Call callback with full verification data including idCommitment
            if (onVerified && result.accountAddress && result.attributes) {
              onVerified({
                idCommitment: data.data.idCommitment,
                accountAddress: result.accountAddress,
                attributes: result.attributes,
              });
            }
          } else {
            // No wallet yet - just return the verification data
            // The onboarding flow will link it later when wallet connects
            if (onVerified && result.accountAddress && result.attributes) {
              // Generate a temporary ID commitment for display purposes
              const tempCommitment = `temp_${result.accountAddress}`;

              onVerified({
                idCommitment: tempCommitment,
                accountAddress: result.accountAddress,
                attributes: result.attributes,
              });
            }
          }

          setStep('success');

          // Close modal after delay
          setTimeout(() => {
            onOpenChange(false);
            setStep('intro');
          }, 2000);
        } catch (err) {
          console.error('Error linking identity:', err);
          setError(
            err instanceof Error ? err.message : 'Failed to link identity'
          );
          setStep('intro');
        } finally {
          setLoading(false);
        }
      }
    );

    return cleanup;
  }, [open, user, onVerified, onOpenChange]);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setStep('launching');

    try {
      // Get wallet address if available, otherwise use a temporary identifier
      const solanaAccount = user?.linkedAccounts.find(
        account => account.type === 'wallet' && account.chain === 'solana'
      );

      const walletAddress = solanaAccount?.address || `temp_${Date.now()}`;

      // Create account creation request
      const request = await createAccountCreationRequest(walletAddress);

      // Launch Concordium ID App
      const launched = await launchConcordiumIDApp(request);

      if (launched) {
        setStep('waiting');
      } else {
        setError(
          'Could not launch Concordium ID App. Please make sure you have the app installed.'
        );
        setStep('intro');
        setLoading(false);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to start verification'
      );
      setStep('intro');
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Concordium Identity Verification
            </DialogTitle>
            <DialogDescription>
              Verify your identity using the official Concordium ID App for
              responsible gambling compliance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {step === 'intro' && (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">How it works:</h4>
                  {process.env.NODE_ENV === 'development' ? (
                    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        Development Mode - Mock Verification
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Click "Verify with Concordium ID App" to simulate
                        identity verification. This will automatically verify
                        with mock data (Age: 25, Jurisdiction: US).
                      </p>
                    </div>
                  ) : (
                    <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                      <li>Click "Verify with Concordium ID App"</li>
                      <li>The Concordium ID App will open</li>
                      <li>Complete identity verification</li>
                      <li>Return here automatically</li>
                    </ol>
                  )}
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Only your age (18+) and jurisdiction will be verified. Your
                    personal information remains private.
                  </AlertDescription>
                </Alert>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Launching...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      {process.env.NODE_ENV === 'development'
                        ? 'Start Mock Verification'
                        : 'Verify with Concordium ID App'}
                      {process.env.NODE_ENV !== 'development' && (
                        <ExternalLink className="ml-2 h-3 w-3" />
                      )}
                    </>
                  )}
                </Button>

                {process.env.NODE_ENV !== 'development' && (
                  <p className="text-center text-xs text-muted-foreground">
                    Don't have the Concordium ID App?{' '}
                    <a
                      href="https://concordium.com/wallet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Download here
                    </a>
                  </p>
                )}
              </>
            )}

            {step === 'launching' && (
              <div className="space-y-4 py-8 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    Launching Concordium ID App...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please wait
                  </p>
                </div>
              </div>
            )}

            {step === 'waiting' && (
              <div className="space-y-4 py-8 text-center">
                <Shield className="mx-auto h-12 w-12 animate-pulse text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    Waiting for verification...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the process in Concordium ID App
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStep('intro')}
                  className="mt-4"
                >
                  Cancel
                </Button>
              </div>
            )}

            {step === 'processing' && (
              <div className="space-y-4 py-8 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    Processing verification...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Almost done!
                  </p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-4 py-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Identity Verified!
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You can now use all features of Darkbet
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
