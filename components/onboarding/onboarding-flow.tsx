'use client';

import { useState, useEffect } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import {
  Shield,
  Wallet,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Info,
} from 'lucide-react';

import { ConcordiumVerifyModalV2 } from '@/components/rg/concordium-verify-modal-v2';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OnboardingFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

type Step = 'intro' | 'concordium' | 'wallet' | 'restrictions' | 'complete';

interface BetRestrictions {
  dailyLimit: string;
  weeklyLimit: string;
  monthlyLimit: string;
  singleBetLimit: string;
  cooldownPeriod: string; // in minutes
}

export function OnboardingFlow({
  open,
  onOpenChange,
  onComplete,
}: OnboardingFlowProps) {
  const { user, login, authenticated } = usePrivy();
  const [step, setStep] = useState<Step>('intro');
  const [showConcordiumModal, setShowConcordiumModal] = useState(false);
  const [concordiumVerified, setConcordiumVerified] = useState(false);
  const [idCommitment, setIdCommitment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [restrictions, setRestrictions] = useState<BetRestrictions>({
    dailyLimit: '1.0',
    weeklyLimit: '5.0',
    monthlyLimit: '20.0',
    singleBetLimit: '0.5',
    cooldownPeriod: '5',
  });

  // Check if user has already completed onboarding
  useEffect(() => {
    if (open) {
      const completed = localStorage.getItem('darkbet_onboarding_completed');
      if (completed === 'true') {
        onComplete();
        onOpenChange(false);
        return;
      }

      // Check if Concordium is already verified
      const storedIdCommitment = localStorage.getItem(
        'concordium_id_commitment'
      );
      if (storedIdCommitment) {
        setConcordiumVerified(true);
        setIdCommitment(storedIdCommitment);
      }
    }
  }, [open, onComplete, onOpenChange]);

  // Auto-advance to wallet step after Concordium verification
  useEffect(() => {
    if (concordiumVerified && step === 'concordium') {
      setStep('wallet');
    }
  }, [concordiumVerified, step]);

  // Auto-advance to restrictions step after wallet connection
  useEffect(() => {
    if (authenticated && step === 'wallet') {
      setStep('restrictions');
    }
  }, [authenticated, step]);

  const handleConcordiumVerified = (data: {
    idCommitment: string;
    accountAddress: string;
    attributes: { age: number; jurisdiction: string };
  }) => {
    // Store ID commitment and attributes temporarily
    // We'll link to wallet in step 2
    setIdCommitment(data.idCommitment);
    setConcordiumVerified(true);
    localStorage.setItem('concordium_id_commitment_temp', data.idCommitment);
    localStorage.setItem('concordium_account_temp', data.accountAddress);
    localStorage.setItem(
      'concordium_attributes_temp',
      JSON.stringify(data.attributes)
    );
    setShowConcordiumModal(false);
  };

  const handleWalletConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await login();

      // After wallet connects, link it to Concordium identity if not already linked
      // This will be handled automatically when user is authenticated
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-link Concordium identity to wallet when wallet connects
  useEffect(() => {
    const linkIdentityToWallet = async () => {
      if (!authenticated || !user) return;

      // Check if we have temporary Concordium data that needs to be linked
      const tempCommitment = localStorage.getItem(
        'concordium_id_commitment_temp'
      );
      const tempAccount = localStorage.getItem('concordium_account_temp');
      const tempAttributes = localStorage.getItem('concordium_attributes_temp');

      if (!tempCommitment || !tempAccount || !tempAttributes) return;

      // Get Solana wallet address
      const solanaAccount = user.linkedAccounts.find(
        account => account.type === 'wallet' && account.chain === 'solana'
      );

      if (!solanaAccount?.address) return;

      try {
        // Link identity to wallet via backend
        const response = await fetch('/api/rg/link-identity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            privyUserId: user.id,
            solanaPublicKey: solanaAccount.address,
            concordiumAccountAddress: tempAccount,
            concordiumAttributes: JSON.parse(tempAttributes),
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Store the real ID commitment
          setIdCommitment(data.data.idCommitment);
          localStorage.setItem(
            'concordium_id_commitment',
            data.data.idCommitment
          );
          localStorage.setItem('concordium_attributes', tempAttributes);

          // Clean up temporary data
          localStorage.removeItem('concordium_id_commitment_temp');
          localStorage.removeItem('concordium_account_temp');
          localStorage.removeItem('concordium_attributes_temp');
        }
      } catch (err) {
        console.error('Failed to link identity to wallet:', err);
        // Don't show error to user - they can continue with temp commitment
      }
    };

    linkIdentityToWallet();
  }, [authenticated, user]);

  const validateRestrictions = (): boolean => {
    const daily = parseFloat(restrictions.dailyLimit);
    const weekly = parseFloat(restrictions.weeklyLimit);
    const monthly = parseFloat(restrictions.monthlyLimit);
    const single = parseFloat(restrictions.singleBetLimit);
    const cooldown = parseInt(restrictions.cooldownPeriod);

    if (
      isNaN(daily) ||
      isNaN(weekly) ||
      isNaN(monthly) ||
      isNaN(single) ||
      isNaN(cooldown)
    ) {
      setError('All fields must be valid numbers');
      return false;
    }

    if (
      daily <= 0 ||
      weekly <= 0 ||
      monthly <= 0 ||
      single <= 0 ||
      cooldown < 0
    ) {
      setError('Limits must be positive numbers');
      return false;
    }

    if (single > daily) {
      setError('Single bet limit cannot exceed daily limit');
      return false;
    }

    if (daily > weekly) {
      setError('Daily limit cannot exceed weekly limit');
      return false;
    }

    if (weekly > monthly) {
      setError('Weekly limit cannot exceed monthly limit');
      return false;
    }

    return true;
  };

  const handleSaveRestrictions = async () => {
    if (!validateRestrictions()) return;

    setLoading(true);
    setError(null);

    try {
      // Get Solana wallet address
      const solanaAccount = user?.linkedAccounts.find(
        account => account.type === 'wallet' && account.chain === 'solana'
      );

      if (!solanaAccount?.address) {
        throw new Error('No Solana wallet connected');
      }

      // Save restrictions to backend
      const response = await fetch('/api/rg/set-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCommitment,
          userAddress: solanaAccount.address,
          limits: {
            dailyLimit: parseFloat(restrictions.dailyLimit),
            weeklyLimit: parseFloat(restrictions.weeklyLimit),
            monthlyLimit: parseFloat(restrictions.monthlyLimit),
            singleBetLimit: parseFloat(restrictions.singleBetLimit),
            cooldownPeriod: parseInt(restrictions.cooldownPeriod) * 60, // Convert minutes to seconds
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save restrictions');
      }

      // Mark onboarding as complete
      localStorage.setItem('darkbet_onboarding_completed', 'true');
      localStorage.setItem('bet_restrictions', JSON.stringify(restrictions));

      setStep('complete');

      // Close modal and complete onboarding after delay
      setTimeout(() => {
        onComplete();
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save restrictions'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <>
            <div className="space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="mb-2 font-semibold text-foreground">
                      Welcome to DarkBet!
                    </p>
                    <p className="text-muted-foreground">
                      Before you start betting, we need to complete a few steps
                      for legal compliance and responsible gambling:
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Verify Identity
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prove you're 18+ using Concordium's privacy-preserving
                      identity system
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Connect Wallet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Connect your Solana wallet to place bets
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Set Betting Limits
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Configure your responsible gambling limits
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep('concordium')} className="w-full">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        );

      case 'concordium':
        return (
          <>
            <div className="space-y-4">
              <div className="py-6 text-center">
                <Shield className="mx-auto mb-4 h-16 w-16 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">
                  Identity Verification
                </h3>
                <p className="text-sm text-muted-foreground">
                  We use Concordium's privacy-preserving identity verification
                  to ensure you're 18+ and in an allowed jurisdiction.
                </p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your personal information stays private. Only your age (18+)
                  and jurisdiction are verified.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {concordiumVerified ? (
                <div className="py-4 text-center">
                  <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
                  <p className="font-semibold text-green-600">
                    Identity Verified!
                  </p>
                  <Button
                    onClick={() => setStep('wallet')}
                    className="mt-4 w-full"
                  >
                    Continue to Wallet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowConcordiumModal(true)}
                  disabled={loading}
                  className="w-full"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Verify with Concordium ID
                </Button>
              )}
            </div>
          </>
        );

      case 'wallet':
        return (
          <>
            <div className="space-y-4">
              <div className="py-6 text-center">
                <Wallet className="mx-auto mb-4 h-16 w-16 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Connect Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Solana wallet to start placing bets on DarkBet.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {authenticated && user ? (
                <div className="py-4 text-center">
                  <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
                  <p className="font-semibold text-green-600">
                    Wallet Connected!
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {user.linkedAccounts
                      .find(
                        account =>
                          account.type === 'wallet' &&
                          account.chain === 'solana'
                      )
                      ?.address.slice(0, 8)}
                    ...
                  </p>
                  <Button
                    onClick={() => setStep('restrictions')}
                    className="mt-4 w-full"
                  >
                    Continue to Limits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleWalletConnect}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Solana Wallet
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        );

      case 'restrictions':
        return (
          <>
            <div className="space-y-4">
              <div className="py-4 text-center">
                <Settings className="mx-auto mb-4 h-16 w-16 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">
                  Set Your Betting Limits
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure responsible gambling limits to help manage your
                  betting activity.
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  These limits help you bet responsibly. You can update them
                  later in your account settings.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Limit (SOL)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={restrictions.dailyLimit}
                    onChange={e =>
                      setRestrictions(prev => ({
                        ...prev,
                        dailyLimit: e.target.value,
                      }))
                    }
                    placeholder="1.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum SOL you can bet per day
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyLimit">Weekly Limit (SOL)</Label>
                  <Input
                    id="weeklyLimit"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={restrictions.weeklyLimit}
                    onChange={e =>
                      setRestrictions(prev => ({
                        ...prev,
                        weeklyLimit: e.target.value,
                      }))
                    }
                    placeholder="5.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit (SOL)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={restrictions.monthlyLimit}
                    onChange={e =>
                      setRestrictions(prev => ({
                        ...prev,
                        monthlyLimit: e.target.value,
                      }))
                    }
                    placeholder="20.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="singleBetLimit">Single Bet Limit (SOL)</Label>
                  <Input
                    id="singleBetLimit"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={restrictions.singleBetLimit}
                    onChange={e =>
                      setRestrictions(prev => ({
                        ...prev,
                        singleBetLimit: e.target.value,
                      }))
                    }
                    placeholder="0.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum SOL per single bet
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooldownPeriod">
                    Cooldown Period (minutes)
                  </Label>
                  <Input
                    id="cooldownPeriod"
                    type="number"
                    step="1"
                    min="0"
                    value={restrictions.cooldownPeriod}
                    onChange={e =>
                      setRestrictions(prev => ({
                        ...prev,
                        cooldownPeriod: e.target.value,
                      }))
                    }
                    placeholder="5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Wait time between consecutive bets
                  </p>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSaveRestrictions}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Limits & Complete Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        );

      case 'complete':
        return (
          <div className="space-y-4 py-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <div>
              <h3 className="mb-2 text-lg font-semibold text-green-600">
                Setup Complete!
              </h3>
              <p className="text-sm text-muted-foreground">
                You're all set to start betting on DarkBet. Have fun and bet
                responsibly!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {step === 'intro' && 'Welcome to DarkBet'}
              {step === 'concordium' && (
                <>
                  <Shield className="h-5 w-5 text-primary" />
                  Identity Verification
                </>
              )}
              {step === 'wallet' && (
                <>
                  <Wallet className="h-5 w-5 text-primary" />
                  Connect Wallet
                </>
              )}
              {step === 'restrictions' && (
                <>
                  <Settings className="h-5 w-5 text-primary" />
                  Betting Limits
                </>
              )}
              {step === 'complete' && 'All Done!'}
            </DialogTitle>
            <DialogDescription>
              {step === 'intro' && 'Complete these steps to start betting'}
              {step === 'concordium' && 'Step 1 of 3'}
              {step === 'wallet' && 'Step 2 of 3'}
              {step === 'restrictions' && 'Step 3 of 3'}
              {step === 'complete' && 'Welcome aboard!'}
            </DialogDescription>
          </DialogHeader>

          {renderStep()}
        </DialogContent>
      </Dialog>

      {/* Concordium Verification Modal */}
      <ConcordiumVerifyModalV2
        open={showConcordiumModal}
        onOpenChange={setShowConcordiumModal}
        onVerified={handleConcordiumVerified}
      />
    </>
  );
}
