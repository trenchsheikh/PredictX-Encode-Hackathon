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
import { useI18n } from '@/components/providers/i18n-provider';
import { cn } from '@/lib/utils';

export default function HowItWorksPage() {
  const { t } = useI18n();
  const steps = [
    {
      number: 1,
      title: t('how_it_works.creating_predictions'),
      icon: Target,
      description: t('how_it_works.creating_predictions_description'),
      details: [
        {
          step: 'Step 1',
          title: t('how_it_works.step1_title'),
          description: t('how_it_works.step1_description')
        },
        {
          step: 'Step 2',
          title: t('how_it_works.step2_title'),
          description: t('how_it_works.step2_description')
        },
        {
          step: 'Step 3',
          title: t('how_it_works.step3_title'),
          description: t('how_it_works.step3_description')
        }
      ],
      categories: [
        { name: t('categories.sports'), icon: '⚽' },
        { name: t('categories.crypto'), icon: '₿' },
        { name: t('categories.politics'), icon: '🏛️' },
        { name: t('categories.entertainment'), icon: '🎬' },
        { name: t('categories.weather'), icon: '🌤️' },
        { name: t('categories.finance'), icon: '💰' },
        { name: t('categories.technology'), icon: '💻' },
        { name: t('categories.custom'), icon: '🎯' }
      ]
    },
    {
      number: 2,
      title: t('how_it_works.dynamic_market_pricing'),
      icon: TrendingUp,
      description: t('how_it_works.dynamic_pricing_description'),
      details: [
        {
          title: t('how_it_works.how_prices_work'),
          items: [
            t('how_it_works.price_mechanism_1'),
            t('how_it_works.price_mechanism_2'),
            t('how_it_works.price_mechanism_3'),
            t('how_it_works.price_mechanism_4')
          ]
        },
        {
          title: t('how_it_works.betting_options'),
          items: [
            t('how_it_works.betting_default'),
            t('how_it_works.betting_custom'),
            t('how_it_works.betting_realtime'),
            t('how_it_works.betting_formula')
          ]
        }
      ],
      example: {
        description: t('how_it_works.pricing_example')
      }
    },
    {
      number: 3,
      title: t('how_it_works.ai_powered_resolution'),
      icon: Bot,
      description: t('how_it_works.ai_resolution_description'),
      layers: [
        {
          title: t('how_it_works.layer1_title'),
          description: t('how_it_works.layer1_description'),
          icon: Database
        },
        {
          title: t('how_it_works.layer2_title'),
          description: t('how_it_works.layer2_description'),
          icon: ExternalLink
        },
        {
          title: t('how_it_works.layer3_title'),
          description: t('how_it_works.layer3_description'),
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
      title: t('how_it_works.claiming_winnings'),
      icon: DollarSign,
      description: t('how_it_works.claiming_description'),
      details: [
        {
          title: t('how_it_works.how_payouts_work'),
          items: [
            t('how_it_works.payout_mechanism_1'),
            t('how_it_works.payout_mechanism_2'),
            t('how_it_works.payout_mechanism_3'),
            t('how_it_works.payout_mechanism_4')
          ]
        },
        {
          title: t('how_it_works.security_features'),
          items: [
            t('how_it_works.security_vault'),
            t('how_it_works.security_verification'),
            t('how_it_works.security_cooldown'),
            t('how_it_works.security_bscscan')
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
      title: t('how_it_works.creator_participation'),
      icon: Users,
      description: t('how_it_works.creator_description'),
      details: [
        {
          title: t('how_it_works.mandatory_creator_stake'),
          description: t('how_it_works.mandatory_stake_description')
        },
        {
          title: t('how_it_works.bet_cancellation_policy'),
          description: t('how_it_works.cancellation_description'),
          items: [
            t('how_it_works.cancellation_1'),
            t('how_it_works.cancellation_2'),
            t('how_it_works.cancellation_3'),
            t('how_it_works.cancellation_4')
          ]
        },
        {
          title: t('how_it_works.fully_automated_resolution'),
          description: t('how_it_works.automated_description'),
          items: [
            t('how_it_works.automated_1'),
            t('how_it_works.automated_2'),
            t('how_it_works.automated_3'),
            t('how_it_works.automated_4')
          ]
        }
      ]
    }
  ];

  const securityFeatures = [
    {
      title: t('how_it_works.blockchain_security'),
      icon: Lock,
      items: [
        t('how_it_works.blockchain_1'),
        t('how_it_works.blockchain_2'),
        t('how_it_works.blockchain_3'),
        t('how_it_works.blockchain_4')
      ]
    },
    {
      title: t('how_it_works.smart_protections'),
      icon: Shield,
      items: [
        t('how_it_works.smart_1'),
        t('how_it_works.smart_2'),
        t('how_it_works.smart_3'),
        t('how_it_works.smart_4')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 font-brand-large gradient-text-brand">
            {t('how_darkbet_works')}
          </h1>
          <p className="text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
            {t('platform_description')}
          </p>
        </div>

        {/* Platform Overview */}
        <Card className="mb-16 bg-black/90 border-black">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('how_it_works.platform_overview')}</h2>
              <p className="text-gray-200">
                {t('how_it_works.platform_description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                  <Database className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">🔗 {t('blockchain_based')}</h3>
                <p className="text-sm text-gray-200">
                  {t('blockchain_description')}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                  <Bot className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">🤖 {t('ai_powered')}</h3>
                <p className="text-sm text-gray-200">
                  {t('ai_description')}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">⚡ {t('real_time')}</h3>
                <p className="text-sm text-gray-200">
                  {t('real_time_description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dark Pools Section */}
        <Card className="mb-16 bg-black/90 border-black">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('dark_pools_title')}</h2>
              <p className="text-gray-200 max-w-4xl mx-auto">
                {t('dark_pools_description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('privacy')}</h3>
                <p className="text-sm text-gray-200">
                  {t('privacy_description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('anti_manipulation')}</h3>
                <p className="text-sm text-gray-200">
                  {t('anti_manipulation_description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('clean_slate')}</h3>
                <p className="text-sm text-gray-200">
                  {t('clean_slate_description')}
                </p>
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-6 border border-yellow-500/30">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                {t('dark_pools_comparison_title')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-red-400 mb-2">❌ {t('traditional_markets_title')}</h4>
                  <ul className="space-y-1 text-sm text-gray-200">
                    {t('traditional_markets_points').split('|').map((point, index) => (
                      <li key={index}>• {point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-medium text-green-400 mb-2">✅ {t('darkbet_dark_pools_title')}</h4>
                  <ul className="space-y-1 text-sm text-gray-200">
                    {t('darkbet_dark_pools_points').split('|').map((point, index) => (
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
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xl">
                    {step.number}
                  </div>
                </div>
                
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-4">
                     <step.icon className="h-8 w-8 text-yellow-400" />
                     <h2 className="text-3xl font-bold text-white font-heading">{step.title}</h2>
                   </div>
                   
                   <p className="text-lg text-gray-300 mb-6">{step.description}</p>
                  
                   {/* Step-specific content */}
                   {step.details && (
                     <div className="space-y-6">
                       {step.details.map((detail, detailIndex) => (
                         <Card key={detailIndex} className="border-l-4 border-l-primary bg-black/90 border-black">
                           <CardContent className="p-6">
                             <div className="flex items-start gap-4">
                               <div className="flex-shrink-0">
                                 <Badge variant="outline" className="text-xs border-white text-white">
                                   {'step' in detail ? detail.step : 'Detail'}
                                 </Badge>
                               </div>
                               <div className="flex-1">
                                 <h3 className="text-lg font-semibold text-white mb-2">
                                   {detail.title}
                                 </h3>
                                 <p className="text-gray-200 mb-3">
                                   {'description' in detail ? detail.description : ''}
                                 </p>
                                 {'items' in detail && detail.items && (
                                   <ul className="space-y-1">
                                     {detail.items.map((item, itemIndex) => (
                                       <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-200">
                                         <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
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
                       <h3 className="text-lg font-semibold text-white mb-4 font-heading">{t('how_it_works.supported_categories')}</h3>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {step.categories.map((category, catIndex) => (
                           <div key={catIndex} className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
                             <span className="text-lg">{category.icon}</span>
                             <span className="text-sm font-medium text-white">{category.name}</span>
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
                           <Card key={layerIndex} className="text-center bg-black/90 border-black">
                             <CardContent className="p-6">
                               <div className="mx-auto w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                                 <layer.icon className="h-6 w-6 text-black" />
                               </div>
                               <h3 className="text-lg font-semibold text-white mb-2">
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
                       <h3 className="text-lg font-semibold text-white mb-4 font-heading">
                         {t('how_it_works.verification_sources')}
                       </h3>
                       <p className="text-sm text-gray-300 mb-4">
                         {t('how_it_works.verification_description')}
                       </p>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {step.sources.map((source, sourceIndex) => (
                           <div key={sourceIndex} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
                             <span className="text-sm font-medium text-white">{source.category}</span>
                             <div className="flex items-center gap-1">
                               <span className="text-xs text-gray-300">
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
                       <h3 className="text-lg font-semibold text-white mb-4 font-heading">{t('common.example')}:</h3>
                       <Card className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
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
                       <h3 className="text-lg font-semibold text-white mb-4 font-heading">{t('how_it_works.platform_fee_structure')}</h3>
                       <Card className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
                         <CardContent className="p-4">
                           <p className="text-sm text-gray-300 mb-3">
                             {t('how_it_works.fee_description')}
                           </p>
                           <div className="space-y-1 text-sm text-white">
                             <div className="flex justify-between">
                               <span>{t('how_it_works.gross_winnings')}</span>
                               <span className="font-medium">{step.feeExample.gross}</span>
                             </div>
                             <div className="flex justify-between text-gray-300">
                               <span>{t('how_it_works.platform_fee')}</span>
                               <span>-{step.feeExample.fee}</span>
                             </div>
                             <div className="flex justify-between text-green-400 font-semibold border-t border-gray-600/50 pt-1">
                               <span>{t('how_it_works.net_payout')}</span>
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
         <Card className="mt-16 bg-black/90 border-black">
           <CardHeader>
             <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-white">
               <Shield className="h-6 w-6 text-yellow-400" />
               {t('how_it_works.security_transparency')}
             </CardTitle>
           </CardHeader>
           <CardContent className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {securityFeatures.map((feature, index) => (
                 <div key={index}>
                   <div className="flex items-center gap-3 mb-4">
                     <feature.icon className="h-6 w-6 text-yellow-400" />
                     <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                   </div>
                   <ul className="space-y-2">
                     {feature.items.map((item, itemIndex) => (
                       <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-200">
                         <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                         <span>{item}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 p-4 rounded-lg bg-yellow-500/20 border-l-4 border-l-yellow-400">
               <div className="flex items-start gap-3">
                 <Eye className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium text-white mb-1">
                     {t('how_it_works.api_keys_masked')}
                   </p>
                   <p className="text-xs text-gray-200">
                     {t('how_it_works.api_keys_description')}
                   </p>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>

         {/* Call to Action */}
         <div className="text-center mt-16">
           <h2 className="text-2xl font-bold text-white mb-4 font-heading">{t('how_it_works.ready_to_start')}</h2>
           <p className="text-gray-300 mb-6">
             {t('how_it_works.ready_description')}
           </p>
           <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold">
             <Target className="h-5 w-5 mr-2" />
             {t('how_it_works.explore_markets')}
             <ArrowRight className="h-4 w-4 ml-2" />
           </Button>
         </div>
      </div>
    </div>
  );
}


