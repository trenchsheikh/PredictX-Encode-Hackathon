/**
 * POST /api/rg/link-identity
 * Link Concordium identity to user account
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateIdCommitment,
  verifyWeb3IdProof,
  registerUser,
} from '@/lib/concordium-service';
import type { ConcordiumWeb3IdProof } from '@/types/concordium';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { privyUserId, solanaPublicKey, concordiumProof } = body;

    // Validate inputs
    if (!privyUserId || !solanaPublicKey || !concordiumProof) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: privyUserId, solanaPublicKey, concordiumProof',
        },
        { status: 400 }
      );
    }

    // Verify Concordium Web3 ID proof
    const verificationResult = await verifyWeb3IdProof(concordiumProof as ConcordiumWeb3IdProof);

    if (!verificationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: verificationResult.error || 'Invalid Concordium proof',
        },
        { status: 400 }
      );
    }

    // Generate anonymous identity commitment
    const idCommitment = generateIdCommitment(privyUserId, solanaPublicKey);

    // Register user in Concordium RG contract
    const registrationResult = await registerUser(idCommitment, verificationResult.attributes!);

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
    //   concordiumProofVerified: true,
    //   kycStatus: 'verified',
    // });

    return NextResponse.json({
      success: true,
      data: {
        idCommitment,
        verified: true,
        kycStatus: 'verified',
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

