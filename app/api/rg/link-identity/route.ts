/**
 * POST /api/rg/link-identity
 * Link Concordium identity to user account
 * Supports both the official Concordium ID App SDK and legacy format
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  generateIdCommitment,
  verifyWeb3IdProof,
  registerUser,
} from '@/lib/concordium-service';
import type { ConcordiumWeb3IdProof } from '@/types/concordium';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      privyUserId,
      solanaPublicKey,
      concordiumAccountAddress,
      concordiumAttributes,
      // Legacy support
      concordiumProof,
    } = body;

    // Validate required fields
    if (!privyUserId || !solanaPublicKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: privyUserId, solanaPublicKey',
        },
        { status: 400 }
      );
    }

    // Handle both new (ID App SDK) and legacy format
    let attributes: {
      age?: number;
      jurisdiction?: string;
      ageVerified: boolean;
      jurisdictionAllowed: boolean;
    };

    if (concordiumAttributes) {
      // New format from official Concordium ID App SDK
      const minimumAge = parseInt(process.env.MINIMUM_AGE || '18');
      const allowedJurisdictions = (
        process.env.ALLOWED_JURISDICTIONS || 'US,UK,CA,AU'
      ).split(',');

      const ageVerified = concordiumAttributes.age >= minimumAge;
      const jurisdictionAllowed = allowedJurisdictions.includes(
        concordiumAttributes.jurisdiction
      );

      if (!ageVerified) {
        return NextResponse.json(
          {
            success: false,
            error: `User must be at least ${minimumAge} years old`,
          },
          { status: 400 }
        );
      }

      if (!jurisdictionAllowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Betting not allowed in jurisdiction: ${concordiumAttributes.jurisdiction}`,
          },
          { status: 400 }
        );
      }

      attributes = {
        age: concordiumAttributes.age,
        jurisdiction: concordiumAttributes.jurisdiction,
        ageVerified: true,
        jurisdictionAllowed: true,
      };
    } else if (concordiumProof) {
      // Legacy format - for backward compatibility
      const verificationResult = await verifyWeb3IdProof(
        concordiumProof as ConcordiumWeb3IdProof
      );

      if (!verificationResult.valid) {
        return NextResponse.json(
          {
            success: false,
            error: verificationResult.error || 'Invalid Concordium proof',
          },
          { status: 400 }
        );
      }

      attributes = {
        ageVerified: verificationResult.attributes?.ageVerified || false,
        jurisdictionAllowed:
          verificationResult.attributes?.jurisdictionAllowed || false,
      };
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing Concordium verification data (concordiumAttributes or concordiumProof)',
        },
        { status: 400 }
      );
    }

    // Generate anonymous identity commitment
    const idCommitment = generateIdCommitment(privyUserId, solanaPublicKey);

    // Register user in Concordium RG contract
    const registrationResult = await registerUser(idCommitment, {
      ageVerified: attributes.ageVerified,
      jurisdictionAllowed: attributes.jurisdictionAllowed,
    });

    if (!registrationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: registrationResult.error || 'Failed to register user',
        },
        { status: 500 }
      );
    }

    // TODO: Update Privy user metadata
    // await privy.updateUserMetadata(privyUserId, {
    //   concordiumIdCommitment: idCommitment,
    //   concordiumAccountAddress: concordiumAccountAddress || undefined,
    //   concordiumProofVerified: true,
    //   kycStatus: 'verified',
    //   riskLevel: 'low',
    // });

    return NextResponse.json({
      success: true,
      data: {
        idCommitment,
        verified: true,
        kycStatus: 'verified',
        accountAddress: concordiumAccountAddress,
      },
    });
  } catch (error) {
    console.error('Error linking Concordium identity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
