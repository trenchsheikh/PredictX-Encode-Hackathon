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
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Database,
  Lock,
  Eye
} from 'lucide-react';
import { useI18n } from '@/components/providers/privy-provider';
import { cn } from '@/lib/utils';

export default function HowItWorksPage() {
  const { t } = useI18n();
  const steps = [
    {
      number: 1,
      title: 'Creating Predictions',
      icon: Target,
      description: 'Simply describe what you want to bet on - AI will handle the rest',
      details: [
        {
          step: 'Step 1',
          title: 'Describe Your Prediction',
          description: 'Simply describe what you want to bet on - AI will handle the rest'
        },
        {
          step: 'Step 2',
          title: 'AI Generates Smart Title',
          description: 'Our AI analyzes your description and creates a clear, searchable title optimized for the platform'
        },
        {
          step: 'Step 3',
          title: 'Automatic Deadline & Category',
          description: 'AI suggests intelligent deadlines (match times for sports, market close for crypto) and assigns the right category'
        }
      ],
      categories: [
        { name: 'Sports', icon: '⚽' },
        { name: 'Crypto', icon: '₿' },
        { name: 'Politics', icon: '🏛️' },
        { name: 'Entertainment', icon: '🎬' },
        { name: 'Weather', icon: '🌤️' },
        { name: 'Finance', icon: '💰' },
        { name: 'Technology', icon: '💻' },
        { name: 'Custom', icon: '🎯' }
      ]
    },
    {
      number: 2,
      title: 'Dynamic Market Pricing (AMM)',
      icon: TrendingUp,
      description: 'BNBPredict uses a Fixed Product Market Maker (FPMM) for fair, dynamic pricing',
      details: [
        {
          title: '📊 How Prices Work',
          items: [
            'Prices determined by pool balance ratios',
            'YES price + NO price = 0.01 BNB always',
            'More bets on one side = higher price for that outcome',
            'Each bet shifts the market slightly'
          ]
        },
        {
          title: '💰 Betting Options',
          items: [
            'Default: Buy 1 share at current market price',
            'Custom: Enter any BNB amount, get calculated shares',
            'Real-time quotes with 30-second validity',
            'Shares = Amount Paid ÷ Current Price'
          ]
        }
      ],
      example: {
        description: 'If YES is trading at 0.006 BNB and you bet 0.01 BNB, you\'ll receive ~1.67 shares. If YES wins, each share pays 0.01 BNB (total: 0.0167 BNB payout).'
      }
    },
    {
      number: 3,
      title: 'AI-Powered Resolution',
      icon: Bot,
      description: 'When bets expire, our multi-layer verification system automatically determines the outcome',
      layers: [
        {
          title: 'Layer 1: Deterministic Checks',
          description: 'Price oracles and on-chain data provide instant, verifiable results for crypto/token bets',
          icon: Database
        },
        {
          title: 'Layer 2: Evidence Gathering',
          description: 'Category-specific APIs fetch real data: weather data for weather bets, sports scores for sports bets, news for political events',
          icon: ExternalLink
        },
        {
          title: 'Layer 3: AI Analysis',
          description: 'Advanced AI analyzes gathered evidence and makes final determination with reasoning',
          icon: Sparkles
        }
      ],
      sources: [
        { category: 'News', count: 5 },
        { category: 'Sports', count: 5 },
        { category: 'Finance', count: 5 },
        { category: 'Politics', count: 5 },
        { category: 'Entertainment', count: 5 },
        { category: 'Weather', count: 1, premium: true },
        { category: 'Blockchain', count: 1, source: 'BSC data' },
        { category: 'Social', count: 1, optional: true }
      ]
    },
    {
      number: 4,
      title: 'Claiming Your Winnings',
      icon: DollarSign,
      description: 'Winners split the total pool proportionally with automatic fee deduction',
      details: [
        {
          title: 'How Payouts Work',
          items: [
            'Winners split the total pool proportionally',
            'Payout = (Your Shares ÷ Total Winning Shares) × Total Pool',
            '10% platform fee automatically deducted',
            'You receive 90% of gross winnings in BNB'
          ]
        },
        {
          title: 'Security Features',
          items: [
            'Secure vault wallet holds all funds',
            'On-chain transaction verification',
            '30-second claim cooldown prevents duplicates',
            'View transaction on BSCScan after claiming'
          ]
        }
      ],
      feeExample: {
        gross: '0.01 BNB',
        fee: '0.001 BNB',
        net: '0.009 BNB'
      }
    },
    {
      number: 5,
      title: 'Creator Participation & Cancellation',
      icon: Users,
      description: 'To ensure quality predictions and prevent spam, creators must actively participate',
      details: [
        {
          title: 'Mandatory Creator Stake',
          description: 'Creators must bet on their own prediction when creating a market. This prevents spam and ensures creators have confidence in their predictions.'
        },
        {
          title: 'Bet Cancellation Policy',
          description: 'If you\'re the only participant in your bet, you can cancel it and receive a refund:',
          items: [
            'Only available when creator is sole participant',
            '10% platform fee applies to cancellations',
            'Instant refund sent to your wallet',
            'Cancel button disappears once another user joins'
          ]
        },
        {
          title: 'Fully Automated Resolution',
          description: 'All bets resolve automatically - no manual intervention required',
          items: [
            'AI analyzes evidence from 25+ verification APIs',
            'Price oracles provide instant crypto/token results',
            'Multi-layer validation ensures accuracy',
            'Winners claim prizes manually (10% fee applies)'
          ]
        }
      ]
    }
  ];

  const securityFeatures = [
    {
      title: '🔐 Blockchain Security',
      icon: Lock,
      items: [
        'All transactions on BNB Smart Chain',
        'Verifiable on BSCScan',
        'Multi-wallet support via Privy',
        'Automatic network switching'
      ]
    },
    {
      title: '🛡️ Smart Protections',
      icon: Shield,
      items: [
        'Server-side price calculations',
        'Zero client trust model',
        'Rate limiting on claims',
        'Database rollback support'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
                 <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
                   {t('how_darkbet_works')}
                 </h1>
          <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            {t('platform_description')}
          </p>
        </div>

        {/* Platform Overview */}
        <Card className="mb-16 card-gradient">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Platform Overview</h2>
              <p className="text-muted-foreground">
                DarkBet is a decentralized prediction market where you can create and participate in bets on real-world events
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">🔗 {t('blockchain_based')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('blockchain_description')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                  <Bot className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">🤖 {t('ai_powered')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('ai_description')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">⚡ {t('real_time')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('real_time_description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.number}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">{step.title}</h2>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                  
                  {/* Step-specific content */}
                  {step.details && (
                    <div className="space-y-6">
                      {step.details.map((detail, detailIndex) => (
                        <Card key={detailIndex} className="border-l-4 border-l-primary">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <Badge variant="outline" className="text-xs">
                                  {detail.step || 'Detail'}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                  {detail.title}
                                </h3>
                                <p className="text-muted-foreground mb-3">
                                  {detail.description}
                                </p>
                                {detail.items && (
                                  <ul className="space-y-1">
                                    {detail.items.map((item, itemIndex) => (
                                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
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
                      <h3 className="text-lg font-semibold text-foreground mb-4">Supported Categories</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {step.categories.map((category, catIndex) => (
                          <div key={catIndex} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Layers for step 3 */}
                  {step.layers && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {step.layers.map((layer, layerIndex) => (
                          <Card key={layerIndex} className="text-center">
                            <CardContent className="p-6">
                              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <layer.icon className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                {layer.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
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
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        🔍 Verification Sources (Masked)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We use industry-leading APIs for verification (sources masked for security):
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {step.sources.map((source, sourceIndex) => (
                          <div key={sourceIndex} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <span className="text-sm font-medium">{source.category}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                {source.count} {source.premium ? 'Premium' : source.optional ? 'Optional' : 'sources'}
                              </span>
                              {source.premium && <Badge variant="warning" className="text-xs">Premium</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Example for step 2 */}
                  {step.example && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Example:</h3>
                      <Card className="bg-accent/5 border-accent/20">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">
                            {step.example.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Fee example for step 4 */}
                  {step.feeExample && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Platform Fee Structure</h3>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-3">
                            10% platform fee applies to both prize claims AND bet cancellations
                          </p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Gross Winnings:</span>
                              <span className="font-medium">{step.feeExample.gross}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Platform Fee (10%):</span>
                              <span>-{step.feeExample.fee}</span>
                            </div>
                            <div className="flex justify-between text-accent font-semibold border-t pt-1">
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
        <Card className="mt-16 card-gradient">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Security & Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-lg bg-muted/50 border-l-4 border-l-accent">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    All API keys and sensitive data are masked
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We never expose internal credentials, vault wallet addresses, or verification source endpoints to protect platform integrity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Predicting?</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet and create your first prediction market today
          </p>
          <Button size="lg" className="btn-primary glow-effect">
            <Target className="h-5 w-5 mr-2" />
            Explore Markets
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}


