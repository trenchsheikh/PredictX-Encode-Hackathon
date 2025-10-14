'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PRIVY_APP_ID, privyClientConfig } from '@/lib/privy-config';
import { createContext, useContext, useMemo, useState } from 'react';

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyClientConfig}>
      <I18nProvider>{children}</I18nProvider>
    </PrivyProvider>
  );
}

// Simple i18n context (EN/ZH)
type Locale = 'en' | 'zh';
type Messages = Record<string, string>;

const defaultMessages: Record<Locale, Messages> = {
  en: {
    nav_home: 'Home',
    nav_my_bets: 'My Bets',
    nav_how: 'How it Works',
    nav_leaderboard: 'Leaderboard',
    connect_wallet: 'Connect Wallet',
    disconnect: 'Disconnect',
    create_bet: 'Make a Prediction',
    live_markets: 'Live Bet Markets',
    // Home page
    hero_subtitle:
      'Private Dark Pool Prediction Markets with AI-Driven Results. Built on BNB Smart Chain.',
    dark_pools_title: 'How Dark Pools Work',
    dark_pools_description:
      'Unlike traditional prediction markets where every bet and position is publicly visible, DarkBet operates through dark pools. Private liquidity layers hide order flow and participant activity until settlement.',
    privacy: 'Privacy',
    privacy_description:
      'Order flow and positions remain hidden until settlement',
    anti_manipulation: 'Anti-Manipulation',
    anti_manipulation_description:
      'Prevents copy-trading and market manipulation',
    clean_slate: 'Clean Slate',
    clean_slate_description:
      'Important actors can place predictions without risking identity',
    dark_pools_comparison_title:
      'How Dark Pools Differ from Traditional Markets',
    traditional_markets_title: 'Traditional Markets',
    traditional_markets_points:
      'All bets and positions are publicly visible|Order flow is transparent to everyone|Vulnerable to copy-trading and manipulation|Participants can be identified and targeted|Market makers can front-run large orders',
    darkbet_dark_pools_title: 'DarkBet Dark Pools',
    darkbet_dark_pools_points:
      'Private liquidity layers hide all activity|Order flow remains confidential until settlement|Prevents copy-trading and manipulation|Protects participant identity and privacy|Fair execution without front-running',
    connect_to_create: 'Connect wallet to create predictions',
    active_predictions: 'Active Predictions',
    total_participants: 'Total Participants',
    total_volume: 'Total Volume',
    total_predictions: 'Total Predictions',
    no_predictions_found: 'No predictions found',
    try_adjusting_filters:
      'Try adjusting your filters or create the first prediction!',
    create_first_prediction: 'Create First Prediction',
    // Make a Prediction Modal
    create_prediction_market: 'Make a Prediction',
    create_prediction_description:
      'Create a prediction market with automated or manual resolution',
    wallet_required: 'Wallet Required',
    connect_wallet_to_create: 'Connect your wallet to create predictions',
    bet_type: 'Bet Type',
    custom_bet: 'Custom Bet',
    manual_resolution: 'Manual resolution',
    auto_verified_outcome: 'Auto-verified outcome',
    price_oracle: 'Price Oracle',
    bet_description: 'Bet Description',
    describe_prediction:
      'Describe your prediction. AI will auto-generate the bet title.',
    ai_resolution_instructions: 'AI Resolution Instructions',
    analyze: 'Analyze',
    analyzing: 'Analyzing...',
    ai_generated: 'AI Generated',
    title: 'Title',
    resolution_instructions: 'Resolution Instructions',
    options: 'Options',
    add_option: 'Add Option',
    place_initial_bet: 'Place Your Initial Bet (Required)',
    prevent_spam:
      'To prevent spam, creators must participate in their own prediction',
    your_prediction: 'Your Prediction',
    bnb_amount: 'BNB Amount',
    click_create_will_prompt:
      'Clicking "Make a Prediction" will prompt your wallet to send {amount} to the vault',
    cancel: 'Cancel',
    creating: 'Creating...',
    // Prediction Card
    yes: 'YES',
    no: 'NO',
    total_pool: 'Total Pool',
    your_bet: 'Your Bet',
    potential_payout: 'Potential Payout',
    resolved: 'Resolved',
    // Footer
    all_rights_reserved: 'All Rights Reserved.',
    // Common
    connecting: 'Connecting...',
    connected: 'Connected',
    // My Bets
    my_bets: 'My Bets',
    track_investments: 'Track your prediction market investments and winnings',
    total_invested: 'Total Invested',
    total_payout: 'Total Payout',
    active_bets: 'Active Bets',
    resolved_bets: 'Resolved Bets',
    all_bets: 'All Bets',
    active: 'Active',
    shares: 'Shares',
    amount: 'Amount',
    price: 'Price',
    resolution: 'Resolution',
    claim: 'Claim',
    claimed: 'Claimed',
    won: 'Won',
    lost: 'Lost',
    no_bets_found: 'No bets found',
    no_active_bets: "You don't have any active bets.",
    no_resolved_bets: "You don't have any resolved bets.",
    no_bets_yet:
      "You haven't placed any bets yet. Start by exploring the prediction markets!",
    explore_markets: 'Explore Markets',
    expires_in: 'Expires in',
    resolved_on: 'Resolved',
    // How it Works
    how_darkbet_works: 'How DarkBet Works',
    platform_overview: 'Platform Overview',
    platform_description:
      'DarkBet is a decentralized prediction market where you can create and participate in bets on real-world events',
    blockchain_based: 'Blockchain-Based',
    blockchain_description:
      'All transactions happen on BNB Smart Chain with native BNB tokens for maximum transparency',
    ai_powered: 'AI-Powered',
    ai_description:
      'Advanced AI generates bet titles, suggests deadlines, and resolves outcomes using real-world data',
    real_time: 'Real-Time',
    real_time_description:
      'Live activity feed and instant updates when bets are created, joined, or resolved',
    // Leaderboard
    leaderboard: 'Leaderboard',
    top_performers: 'Top performers on DarkBet prediction markets',
    total_players: 'Total Players',
    total_winnings: 'Total Winnings',
    avg_win_rate: 'Avg Win Rate',
    timeframe: 'Timeframe',
    all_time: 'All Time',
    days_7: '7 Days',
    days_30: '30 Days',
    days_90: '90 Days',
    category: 'Category',
    all_categories: 'All Categories',
    crypto: 'Crypto',
    sports: 'Sports',
    politics: 'Politics',
    entertainment: 'Entertainment',
    sort_by: 'Sort By',
    total_winnings_sort: 'Total Winnings',
    win_rate_sort: 'Win Rate',
    total_volume_sort: 'Total Volume',
    total_bets_sort: 'Total Bets',
    winnings: 'Winnings',
    win_rate: 'Win Rate',
    bets: 'Bets',
    volume: 'Volume',
    view: 'View',
    more_features_coming: 'More Features Coming Soon',
    working_on_features:
      "We're working on adding more detailed analytics, historical data, and advanced filtering options.",
    historical_charts: 'Historical Charts',
    advanced_filters: 'Advanced Filters',
    portfolio_tracking: 'Portfolio Tracking',
    achievement_system: 'Achievement System',
  },
  zh: {
    nav_home: '主页',
    nav_my_bets: '我的投注',
    nav_how: '使用说明',
    nav_leaderboard: '排行榜',
    connect_wallet: '连接钱包',
    disconnect: '断开连接',
    create_bet: '做出预测',
    live_markets: '实时投注市场',
    // Home page
    hero_subtitle: '私有暗池预测市场，AI驱动结果。基于BNB智能链构建。',
    dark_pools_title: '暗池工作原理',
    dark_pools_description:
      '与传统的预测市场不同，传统市场中每个投注和头寸都是公开可见的，DarkBet通过暗池运作。私有流动性层隐藏订单流和参与者活动，直到结算。',
    privacy: '隐私',
    privacy_description: '订单流和头寸在结算前保持隐藏',
    anti_manipulation: '反操纵',
    anti_manipulation_description: '防止跟单交易和市场操纵',
    clean_slate: '干净环境',
    clean_slate_description: '重要参与者可以在不暴露身份的情况下进行预测',
    dark_pools_comparison_title: '暗池与传统市场的区别',
    traditional_markets_title: '传统市场',
    traditional_markets_points:
      '所有投注和头寸都公开可见|订单流对所有人透明|容易受到跟单交易和操纵|参与者可能被识别和针对|做市商可以抢跑大订单',
    darkbet_dark_pools_title: 'DarkBet暗池',
    darkbet_dark_pools_points:
      '私有流动性层隐藏所有活动|订单流在结算前保持机密|防止跟单交易和操纵|保护参与者身份和隐私|公平执行，无抢跑',
    connect_to_create: '连接钱包以创建预测',
    active_predictions: '活跃预测',
    total_participants: '总参与者',
    total_volume: '总交易量',
    total_predictions: '总预测数',
    no_predictions_found: '未找到预测',
    try_adjusting_filters: '尝试调整筛选条件或创建第一个预测！',
    create_first_prediction: '创建第一个预测',
    // Make a Prediction Modal
    create_prediction_market: '做出预测',
    create_prediction_description: '创建具有自动或手动解析的预测市场',
    wallet_required: '需要钱包',
    connect_wallet_to_create: '连接您的钱包以创建预测',
    bet_type: '投注类型',
    custom_bet: '自定义投注',
    manual_resolution: '手动解析',
    auto_verified_outcome: '自动验证结果',
    price_oracle: '价格预言机',
    bet_description: '投注描述',
    describe_prediction: '描述您的预测。AI将自动生成投注标题。',
    ai_resolution_instructions: 'AI解析说明',
    analyze: '分析',
    analyzing: '分析中...',
    ai_generated: 'AI生成',
    title: '标题',
    resolution_instructions: '解析说明',
    options: '选项',
    add_option: '添加选项',
    place_initial_bet: '下您的初始投注（必需）',
    prevent_spam: '为防止垃圾信息，创建者必须参与自己的预测',
    your_prediction: '您的预测',
    bnb_amount: 'BNB数量',
    click_create_will_prompt: '点击"创建投注"将提示您的钱包发送{amount}到金库',
    cancel: '取消',
    creating: '创建中...',
    // Prediction Card
    yes: '是',
    no: '否',
    total_pool: '总奖池',
    your_bet: '您的投注',
    potential_payout: '潜在收益',
    resolved: '已解析',
    // Footer
    all_rights_reserved: '版权所有。',
    // Common
    connecting: '连接中...',
    connected: '已连接',
    // My Bets
    my_bets: '我的投注',
    track_investments: '跟踪您的预测市场投资和收益',
    total_invested: '总投资',
    total_payout: '总收益',
    active_bets: '活跃投注',
    resolved_bets: '已解析投注',
    all_bets: '所有投注',
    active: '活跃',
    shares: '份额',
    amount: '金额',
    price: '价格',
    resolution: '解析',
    claim: '领取',
    claimed: '已领取',
    won: '获胜',
    lost: '失败',
    no_bets_found: '未找到投注',
    no_active_bets: '您没有任何活跃投注。',
    no_resolved_bets: '您没有任何已解析投注。',
    no_bets_yet: '您还没有进行任何投注。开始探索预测市场吧！',
    explore_markets: '探索市场',
    expires_in: '到期时间',
    resolved_on: '解析于',
    // How it Works
    how_darkbet_works: 'DarkBet如何运作',
    platform_overview: '平台概览',
    platform_description:
      'DarkBet是一个去中心化预测市场，您可以创建和参与现实世界事件的投注',
    blockchain_based: '基于区块链',
    blockchain_description:
      '所有交易都在BNB智能链上进行，使用原生BNB代币确保最大透明度',
    ai_powered: 'AI驱动',
    ai_description:
      '先进AI生成投注标题，建议截止时间，并使用真实世界数据解析结果',
    real_time: '实时',
    real_time_description: '实时活动动态和即时更新，当投注被创建、加入或解析时',
    // Leaderboard
    leaderboard: '排行榜',
    top_performers: 'DarkBet预测市场顶级表现者',
    total_players: '总玩家',
    total_winnings: '总奖金',
    avg_win_rate: '平均胜率',
    timeframe: '时间范围',
    all_time: '全部时间',
    days_7: '7天',
    days_30: '30天',
    days_90: '90天',
    category: '类别',
    all_categories: '所有类别',
    crypto: '加密货币',
    sports: '体育',
    politics: '政治',
    entertainment: '娱乐',
    sort_by: '排序方式',
    total_winnings_sort: '总奖金',
    win_rate_sort: '胜率',
    total_volume_sort: '总交易量',
    total_bets_sort: '总投注',
    winnings: '奖金',
    win_rate: '胜率',
    bets: '投注',
    volume: '交易量',
    view: '查看',
    more_features_coming: '更多功能即将推出',
    working_on_features: '我们正在添加更详细的分析、历史数据和高级筛选选项。',
    historical_charts: '历史图表',
    advanced_filters: '高级筛选',
    portfolio_tracking: '投资组合跟踪',
    achievement_system: '成就系统',
  },
};

const I18nContext = createContext<{
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
}>({ locale: 'en', t: k => defaultMessages.en[k] || k, setLocale: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) =>
        defaultMessages[locale]?.[key] ?? defaultMessages.en[key] ?? key,
    }),
    [locale]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
