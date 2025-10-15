'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Target,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Users,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Database,
  Lock,
  Eye,
} from 'lucide-react';
import { useI18n } from '@/components/providers/privy-provider';

export default function HowItWorksPage() {
  const { t } = useI18n();
  const steps = [
    {
      number: 1,
      title: 'Creating Predictions',
      icon: Target,
      description:
        'Simply describe what you want to bet on - AI will handle the rest',
      details: [
        {
          step: 'Step 1',
          title: 'Describe Your Prediction',
          description:
            'Simply describe what you want to bet on - AI will handle the rest',
        },
        {
          step: 'Step 2',
          title: 'AI Generates Smart Title',
          description:
            'Our AI analyzes your description and creates a clear, searchable title optimized for the platform',
        },
        {
          step: 'Step 3',
          title: 'Automatic Deadline & Category',
          description:
            'AI suggests intelligent deadlines (match times for sports, market close for crypto) and assigns the right category',
        },
      ],
      categories: [
        { name: 'Sports', icon: '⚽' },
        { name: 'Crypto', icon: '₿' },
        { name: 'Politics', icon: '🏛️' },
        { name: 'Entertainment', icon: '🎬' },
        { name: 'Weather', icon: '🌤️' },
        { name: 'Finance', icon: '💰' },
        { name: 'Technology', icon: '💻' },
        { name: 'Custom', icon: '🎯' },
      ],
    },
    {
      number: 2,
      title: 'Dynamic Market Pricing (AMM)',
      icon: TrendingUp,
      description:
        'BNBPredict uses a Fixed Product Market Maker (FPMM) for fair, dynamic pricing',
      details: [
        {
          title: '📊 How Prices Work',
          items: [
            'Prices determined by pool balance ratios',
            'YES price + NO price = 0.01 BNB always',
            'More bets on one side = higher price for that outcome',
            'Each bet shifts the market slightly',
          ],
        },
        {
          title: '💰 Betting Options',
          items: [
            'Default: Buy 1 share at current market price',
            'Custom: Enter any BNB amount, get calculated shares',
            'Real-time quotes with 30-second validity',
            'Shares = Amount Paid ÷ Current Price',
          ],
        },
      ],
      example: {
        description:
          "If YES is trading at 0.006 BNB and you bet 0.01 BNB, you'll receive ~1.67 shares. If YES wins, each share pays 0.01 BNB (total: 0.0167 BNB payout).",
      },
    },
    {
      number: 3,
      title: 'AI-Powered Resolution',
      icon: Bot,
      description:
        'When bets expire, our multi-layer verification system automatically determines the outcome',
      layers: [
        {
          title: 'Layer 1: Deterministic Checks',
          description:
            'Price oracles and on-chain data provide instant, verifiable results for crypto/token bets',
          icon: Database,
        },
        {
          title: 'Layer 2: Evidence Gathering',
          description:
            'Category-specific APIs fetch real data: weather data for weather bets, sports scores for sports bets, news for political events',
          icon: ExternalLink,
        },
        {
          title: 'Layer 3: AI Analysis',
          description:
            'Advanced AI analyzes gathered evidence and makes final determination with reasoning',
          icon: Sparkles,
        },
      ],
      sources: [
        { category: 'News', count: 5 },
        { category: 'Sports', count: 5 },
        { category: 'Finance', count: 5 },
        { category: 'Politics', count: 5 },
        { category: 'Entertainment', count: 5 },
        { category: 'Weather', count: 1, premium: true },
        { category: 'Blockchain', count: 1, source: 'BSC data' },
        { category: 'Social', count: 1, optional: true },
      ],
    },
    {
      number: 4,
      title: 'Claiming Your Winnings',
      icon: DollarSign,
      description:
        'Winners split the total pool proportionally with automatic fee deduction',
      details: [
        {
          title: 'How Payouts Work',
          items: [
            'Winners split the total pool proportionally',
            'Payout = (Your Shares ÷ Total Winning Shares) × Total Pool',
            '10% platform fee automatically deducted',
            'You receive 90% of gross winnings in BNB',
          ],
        },
        {
          title: 'Security Features',
          items: [
            'Secure vault wallet holds all funds',
            'On-chain transaction verification',
            '30-second claim cooldown prevents duplicates',
            'View transaction on BSCScan after claiming',
          ],
        },
      ],
      feeExample: {
        gross: '0.01 BNB',
        fee: '0.001 BNB',
        net: '0.009 BNB',
      },
    },
    {
      number: 5,
      title: 'Creator Participation & Cancellation',
      icon: Users,
      description:
        'To ensure quality predictions and prevent spam, creators must actively participate',
      details: [
        {
          title: 'Mandatory Creator Stake',
          description:
            'Creators must bet on their own prediction when creating a market. This prevents spam and ensures creators have confidence in their predictions.',
        },
        {
          title: 'Bet Cancellation Policy',
          description:
            "If you're the only participant in your bet, you can cancel it and receive a refund:",
          items: [
            'Only available when creator is sole participant',
            '10% platform fee applies to cancellations',
            'Instant refund sent to your wallet',
            'Cancel button disappears once another user joins',
          ],
        },
        {
          title: 'Fully Automated Resolution',
          description:
            'All bets resolve automatically - no manual intervention required',
          items: [
            'AI analyzes evidence from 25+ verification APIs',
            'Price oracles provide instant crypto/token results',
            'Multi-layer validation ensures accuracy',
            'Winners claim prizes manually (10% fee applies)',
          ],
        },
      ],
    },
  ];

  const securityFeatures = [
    {
      title: 'Blockchain Security',
      icon: Lock,
      items: [
        'All transactions on BNB Smart Chain',
        'Verifiable on BSCScan',
        'Multi-wallet support via Privy',
        'Automatic network switching',
      ],
    },
    {
      title: 'Smart Protections',
      icon: Shield,
      items: [
        'Server-side price calculations',
        'Zero client trust model',
        'Rate limiting on claims',
        'Database rollback support',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-brand-large gradient-text-brand mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {t('how_darkbet_works')}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300">
            {t('platform_description')}
          </p>
        </div>

        {/* Platform Overview */}
        <Card className="mb-16 border-black bg-black/90">
          <CardContent className="p-4 sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500">
                <Target className="h-8 w-8 text-black" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Platform Overview
              </h2>
              <p className="text-gray-200">
                DarkBet is a decentralized prediction market where you can
                create and participate in bets on real-world events
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                  <Database className="h-6 w-6 text-black" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t('blockchain_based')}
                </h3>
                <p className="text-sm text-gray-200">
                  {t('blockchain_description')}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                  <Bot className="h-6 w-6 text-black" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  🤖 {t('ai_powered')}
                </h3>
                <p className="text-sm text-gray-200">{t('ai_description')}</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  ⚡ {t('real_time')}
                </h3>
                <p className="text-sm text-gray-200">
                  {t('real_time_description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dark Pools Section */}
        <Card className="mb-16 border-black bg-black/90">
          <CardContent className="p-4 sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500">
                <Eye className="h-8 w-8 text-black" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                {t('dark_pools_title')}
              </h2>
              <p className="mx-auto max-w-4xl text-gray-200">
                {t('dark_pools_description')}
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t('privacy')}
                </h3>
                <p className="text-sm text-gray-200">
                  {t('privacy_description')}
                </p>
              </div>

              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t('anti_manipulation')}
                </h3>
                <p className="text-sm text-gray-200">
                  {t('anti_manipulation_description')}
                </p>
              </div>

              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t('clean_slate')}
                </h3>
                <p className="text-sm text-gray-200">
                  {t('clean_slate_description')}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-yellow-500/30 bg-black/50 p-4 sm:p-6">
              <h3 className="mb-4 text-center text-lg font-semibold text-white">
                {t('dark_pools_comparison_title')}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-md mb-2 font-medium text-red-400">
                    ❌ {t('traditional_markets_title')}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-200">
                    {t('traditional_markets_points')
                      .split('|')
                      .map((point, index) => (
                        <li key={index}>• {point}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-md mb-2 font-medium text-green-400">
                    ✅ {t('darkbet_dark_pools_title')}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-200">
                    {t('darkbet_dark_pools_points')
                      .split('|')
                      .map((point, index) => (
                        <li key={index}>• {point}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-xl font-bold text-black sm:h-16 sm:w-16">
                    {step.number}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3 sm:mb-4">
                    <step.icon className="h-8 w-8 text-yellow-400" />
                    <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                      {step.title}
                    </h2>
                  </div>

                  <p className="mb-6 text-base text-gray-300 sm:text-lg">
                    {step.description}
                  </p>

                  {/* Step-specific content */}
                  {step.details && (
                    <div className="space-y-6">
                      {step.details.map((detail, detailIndex) => (
                        <Card
                          key={detailIndex}
                          className="border-l-4 border-black border-l-primary bg-black/90"
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <Badge
                                  variant="outline"
                                  className="border-white text-xs text-white"
                                >
                                  {'step' in detail ? detail.step : 'Detail'}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <h3 className="mb-2 text-lg font-semibold text-white">
                                  {detail.title}
                                </h3>
                                <p className="mb-3 text-gray-200">
                                  {'description' in detail
                                    ? detail.description
                                    : ''}
                                </p>
                                {'items' in detail && detail.items && (
                                  <ul className="space-y-1">
                                    {detail.items.map((item, itemIndex) => (
                                      <li
                                        key={itemIndex}
                                        className="flex items-start gap-2 text-sm text-gray-200"
                                      >
                                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Categories for step 1 */}
                  {step.categories && (
                    <div className="mt-6">
                      <h3 className="font-heading mb-4 text-lg font-semibold text-white">
                        Supported Categories
                      </h3>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {step.categories.map((category, catIndex) => (
                          <div
                            key={catIndex}
                            className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/60 p-3 backdrop-blur-sm"
                          >
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium text-white">
                              {category.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layers for step 3 */}
                  {step.layers && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {step.layers.map((layer, layerIndex) => (
                          <Card
                            key={layerIndex}
                            className="border-black bg-black/90 text-center"
                          >
                            <CardContent className="p-4 sm:p-6">
                              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500">
                                <layer.icon className="h-6 w-6 text-black" />
                              </div>
                              <h3 className="mb-2 text-lg font-semibold text-white">
                                {layer.title}
                              </h3>
                              <p className="text-sm text-gray-200">
                                {layer.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources for step 3 */}
                  {step.sources && (
                    <div className="mt-6">
                      <h3 className="font-heading mb-4 text-lg font-semibold text-white">
                        🔍 Verification Sources (Masked)
                      </h3>
                      <p className="mb-4 text-sm text-gray-300">
                        We use industry-leading APIs for verification (sources
                        masked for security):
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                        {step.sources.map((source, sourceIndex) => (
                          <div
                            key={sourceIndex}
                            className="flex items-center justify-between rounded-lg border border-gray-700/50 bg-gray-800/60 p-3 backdrop-blur-sm"
                          >
                            <span className="text-sm font-medium text-white">
                              {source.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-300">
                                {source.count}{' '}
                                {source.premium
                                  ? 'Premium'
                                  : source.optional
                                    ? 'Optional'
                                    : 'sources'}
                              </span>
                              {source.premium && (
                                <Badge variant="warning" className="text-xs">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example for step 2 */}
                  {step.example && (
                    <div className="mt-6">
                      <h3 className="font-heading mb-4 text-lg font-semibold text-white">
                        Example:
                      </h3>
                      <Card className="border border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-300">
                            {step.example.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Fee example for step 4 */}
                  {step.feeExample && (
                    <div className="mt-6">
                      <h3 className="font-heading mb-4 text-lg font-semibold text-white">
                        Platform Fee Structure
                      </h3>
                      <Card className="border border-gray-700/50 bg-gray-800/60 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <p className="mb-3 text-sm text-gray-300">
                            10% platform fee applies to both prize claims AND
                            bet cancellations
                          </p>
                          <div className="space-y-1 text-sm text-white">
                            <div className="flex justify-between">
                              <span>Gross Winnings:</span>
                              <span className="font-medium">
                                {step.feeExample.gross}
                              </span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>Platform Fee (10%):</span>
                              <span>-{step.feeExample.fee}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-600/50 pt-1 font-semibold text-green-400">
                              <span>Net Payout:</span>
                              <span>{step.feeExample.net} ✨</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Transparency */}
        <Card className="mt-16 border-black bg-black/90">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-center text-2xl font-bold text-white">
              <Shield className="h-6 w-6 text-yellow-400" />
              Security & Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {securityFeatures.map((feature, index) => (
                <div key={index}>
                  <div className="mb-4 flex items-center gap-3">
                    <feature.icon className="h-6 w-6 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-sm text-gray-200"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border-l-4 border-l-yellow-400 bg-yellow-500/20 p-4">
              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
                <div>
                  <p className="mb-1 text-sm font-medium text-white">
                    All API keys and sensitive data are masked
                  </p>
                  <p className="text-xs text-gray-200">
                    We never expose internal credentials, vault wallet
                    addresses, or verification source endpoints to protect
                    platform integrity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="font-heading mb-4 text-2xl font-bold text-white">
            Ready to Start Predicting?
          </h2>
          <p className="mb-6 text-gray-300">
            Connect your wallet and create your first prediction market today
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 font-semibold text-black hover:from-yellow-500 hover:to-yellow-700"
          >
            <Target className="mr-2 h-5 w-5" />
            Explore Markets
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
