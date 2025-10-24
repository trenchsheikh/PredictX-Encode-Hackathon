'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface ConcordiumVerifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: (idCommitment: string) => void;
}

export function ConcordiumVerifyModal({
  open,
  onOpenChange,
  onVerified,
}: ConcordiumVerifyModalProps) {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'intro' | 'verify' | 'success'>('intro');

  const handleVerify = async () => {
    if (!user) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get Solana wallet address
      const solanaAccount = user.linkedAccounts.find(
        (account) => account.type === 'wallet' && account.chain === 'solana'
      );

      if (!solanaAccount || !solanaAccount.address) {
        throw new Error('No Solana wallet connected');
      }

      setStep('verify');

      // TODO: Integrate actual Concordium Web3 ID flow
      // For now, this is a mock implementation
      
      // In production, this would:
      // 1. Redirect to Concordium ID provider
      // 2. User authenticates and selects attributes to reveal
      // 3. ID provider issues Web3 ID credential
      // 4. User returns with proof
      
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock proof (in production, this comes from Concordium wallet)
      const mockProof = {
        proof: {
          type: 'Ed25519Signature2020',
          created: new Date().toISOString(),
          proofValue: 'mock_signature',
          proofPurpose: 'assertionMethod',
          verificationMethod: 'did:concordium:testnet:cred/mock',
        },
        credential: {
          id: 'did:concordium:testnet:cred/mock',
          type: ['VerifiableCredential', 'Web3IdCredential'],
          issuer: 'did:concordium:testnet:issuer/mock',
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:concordium:testnet:holder/mock',
            attributes: {
              age: 25,
              jurisdiction: 'US',
            },
          },
        },
        signature: 'mock_signature_value',
      };

      // Link identity
      const response = await fetch('/api/rg/link-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privyUserId: user.id,
          solanaPublicKey: solanaAccount.address,
          concordiumProof: mockProof,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to verify identity');
      }

      setStep('success');
      
      // Call callback with identity commitment
      if (onVerified) {
        onVerified(data.data.idCommitment);
      }

      // Close modal after delay
      setTimeout(() => {
        onOpenChange(false);
        setStep('intro');
      }, 2000);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify identity');
      setStep('intro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Identity Verification
          </DialogTitle>
          <DialogDescription>
            Verify your identity using Concordium Web3 ID to enable responsible gambling features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'intro' && (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">What is Concordium Web3 ID?</h4>
                <p className="text-sm text-muted-foreground">
                  Concordium Web3 ID provides privacy-preserving identity verification. You only reveal
                  your age and jurisdiction, keeping other personal information private.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Why verify?</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Required for legal compliance</li>
                  <li>Enables responsible gambling features</li>
                  <li>Set custom betting limits</li>
                  <li>Self-exclusion options</li>
                </ul>
              </div>

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
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify with Concordium
                  </>
                )}
              </Button>
            </>
          )}

          {step === 'verify' && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div>
                <p className="text-sm font-medium">Verifying your identity...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a few seconds
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-600">Identity Verified!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You can now use all features of Darkbet
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

