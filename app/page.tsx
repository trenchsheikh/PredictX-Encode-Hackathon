'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useSendTransaction } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictionCard } from '@/components/prediction/prediction-card';
import { Filters } from '@/components/prediction/filters';
import { CreateBetModal } from '@/components/prediction/create-bet-modal';
import { Particles } from '@/components/ui/particles';
import { ShimmeringText } from '@/components/ui/shimmering-text';
import { AppleHelloEffect } from '@/components/ui/apple-hello-effect';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { Prediction, FilterOptions, CreatePredictionData } from '@/types/prediction';
import { Plus, TrendingUp, Users, Clock, Zap, Star, Trophy, Flame, Target, BarChart3, TrendingDown, ArrowUp, ArrowDown, Eye, Shield, Lock } from 'lucide-react';
import { useI18n } from '@/components/providers/privy-provider';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockPredictions: Prediction[] = [
  {
    id: '1',
    title: 'Will BNB reach $1,000 by end of 2025?',
    description: 'BNB price prediction for Q4 2025 based on BSC ecosystem growth, BNB Chain developments, and increasing DeFi adoption.',
    summary: 'This prediction market focuses on whether BNB will reach $1,000 by December 31, 2025.\n\nIf YES wins: BNB would need to increase approximately 70% from current levels. This could happen if the BNB Chain ecosystem experiences significant growth in DeFi TVL, new dApp launches increase substantially, BNB burn mechanisms accelerate deflation, and institutional adoption of BSC increases. Major developments like new partnerships, exchange integrations, or regulatory clarity could also drive this outcome.\n\nIf NO wins: BNB would remain below $1,000 through year-end 2025. This could occur if crypto market conditions remain bearish, BNB Chain faces increased competition from other L1s, DeFi activity on BSC stagnates or declines, or macro-economic factors limit crypto investment. Regulatory challenges or technical issues could also prevent the price target from being reached.',
    category: 'crypto',
    status: 'active',
    createdAt: Date.now() - 86400000 * 2,
    expiresAt: Date.now() + 86400000 * 75, // ~2.5 months (End of Dec 2025)
    creator: '0xBNB1...2025',
    totalPool: 2.5,
    yesPool: 1.6,
    noPool: 0.9,
    yesPrice: 0.0064,
    noPrice: 0.0036,
    totalShares: 250,
    yesShares: 160,
    noShares: 90,
    participants: 45,
    isHot: true,
  },
  {
    id: '2',
    title: 'Will Bitcoin reach $200,000 in 2026?',
    description: 'Bitcoin price prediction for 2026 considering post-halving bull cycle, institutional adoption, and spot ETF inflows.',
    summary: 'This market predicts whether Bitcoin will reach $200,000 at any point during 2026.\n\nIf YES wins: Bitcoin would more than double from current levels. The 2024 halving event historically triggers bull cycles 12-18 months later, potentially driving this outcome. Continued Bitcoin ETF adoption, increased institutional treasury allocations (following MicroStrategy\'s model), nation-state adoption, and global macroeconomic instability could push BTC to this level. Additionally, supply shock from halving combined with sustained demand would support this scenario.\n\nIf NO wins: Bitcoin would remain below $200,000 throughout 2026. This could result from regulatory crackdowns in major markets, reduced institutional interest, extended crypto winter conditions, or the post-halving rally failing to materialize as expected. Competition from other cryptocurrencies, macroeconomic factors favoring traditional assets, or technical resistance levels could also prevent Bitcoin from reaching this price target.',
    category: 'crypto',
    status: 'active',
    createdAt: Date.now() - 86400000,
    expiresAt: Date.now() + 86400000 * 440, // ~14 months (End of 2026)
    creator: '0xBTC2...00K',
    totalPool: 4.8,
    yesPool: 2.9,
    noPool: 1.9,
    yesPrice: 0.0061,
    noPrice: 0.0039,
    totalShares: 480,
    yesShares: 290,
    noShares: 190,
    participants: 112,
    isHot: true,
  },
  {
    id: '3',
    title: 'Will Inter Miami win MLS Cup 2025?',
    description: 'MLS Championship prediction with Lionel Messi leading Inter Miami in the 2025 season playoffs.',
    summary: 'This prediction market determines whether Inter Miami CF will win the 2025 MLS Cup Championship.\n\nIf YES wins: Inter Miami would capture their first MLS Cup title. With Lionel Messi anchoring the attack, Luis Suárez providing experience, and Sergio Busquets controlling midfield, the team has world-class talent. Success would require staying healthy through the playoffs, maintaining strong regular season form to secure home-field advantage, and the supporting cast stepping up in crucial moments. Messi\'s playoff experience and ability to perform in high-pressure situations would be critical factors.\n\nIf NO wins: Inter Miami would fall short of the championship. This could happen due to playoff injuries to key players, defensive vulnerabilities being exposed by elite MLS teams, inconsistent performances in knockout games, or simply being outplayed by stronger opposition. Other competitive Eastern Conference teams with deeper rosters, better team chemistry, or tactical advantages could eliminate Miami before the final. Single-elimination playoff format also increases variance and upset potential.',
    category: 'sports',
    status: 'active',
    createdAt: Date.now() - 86400000 * 3,
    expiresAt: Date.now() + 86400000 * 50, // ~7 weeks (Early December 2025)
    creator: '0xMessi...MLS',
    totalPool: 2.1,
    yesPool: 1.3,
    noPool: 0.8,
    yesPrice: 0.0062,
    noPrice: 0.0038,
    totalShares: 210,
    yesShares: 130,
    noShares: 80,
    participants: 58,
    isHot: true,
  },
  {
    id: '4',
    title: 'Will Ethereum reach $8,000 by Q2 2026?',
    description: 'Ethereum price prediction following staking yield growth, L2 scaling improvements, and institutional DeFi adoption.',
    summary: 'This market predicts whether Ethereum will reach $8,000 by the end of Q2 2026 (June 30, 2026).\n\nIf YES wins: Ethereum would need to more than double from current levels. This could be driven by explosive growth in Layer 2 solutions (Arbitrum, Optimism, Base) increasing network usage while reducing fees, rising staking yields attracting institutional capital, successful implementation of future upgrades improving scalability, and major institutions building DeFi applications on Ethereum. The transition to proof-of-stake and deflationary tokenomics could also support this price level if demand remains strong.\n\nIf NO wins: Ethereum would remain below $8,000 through June 2026. This could result from Layer 1 competition intensifying (Solana, Avalanche capturing market share), L2 solutions cannibalizing mainnet value, regulatory uncertainty around DeFi and staking, macroeconomic headwinds limiting risk asset appreciation, or technical challenges delaying planned upgrades. Gas fees remaining high despite L2 growth could also limit adoption and price appreciation.',
    category: 'crypto',
    status: 'active',
    createdAt: Date.now() - 86400000 * 4,
    expiresAt: Date.now() + 86400000 * 240, // ~8 months (June 2026)
    creator: '0xETH8...000',
    totalPool: 3.7,
    yesPool: 2.2,
    noPool: 1.5,
    yesPrice: 0.0059,
    noPrice: 0.0041,
    totalShares: 370,
    yesShares: 220,
    noShares: 150,
    participants: 84,
    isHot: true,
  },
  {
    id: '5',
    title: 'Will Manchester City win Premier League 2025-2026?',
    description: 'English Premier League title prediction for the 2025-2026 season with Pep Guardiola\'s Manchester City.',
    summary: 'This prediction determines whether Manchester City will win the 2025-2026 Premier League title.\n\nIf YES wins: Manchester City would secure another Premier League championship under Pep Guardiola. Their success would likely stem from tactical superiority, squad depth allowing rotation without quality drop-off, dominant home form at the Etihad, and consistency across the 38-game season. Key factors would include Erling Haaland maintaining elite goal-scoring form, midfield control from Rodri and De Bruyne, and the defensive solidity that has characterized their recent dominance. Their financial resources and elite academy also support sustained success.\n\nIf NO wins: Manchester City would fail to win the title, potentially ending their recent dynasty. This could happen if key injuries impact squad depth (particularly Rodri or Haaland), Arsenal or Liverpool mount stronger sustained challenges, tactical evolution from rivals neutralizes City\'s style, or off-field issues (financial investigations, management changes) create instability. New ownership at other clubs, increased competition intensity, or simply regression to the mean after sustained excellence could also prevent another title.',
    category: 'sports',
    status: 'active',
    createdAt: Date.now() - 86400000 * 5,
    expiresAt: Date.now() + 86400000 * 250, // ~8.3 months (May 2026)
    creator: '0xCity...PL26',
    totalPool: 2.4,
    yesPool: 1.4,
    noPool: 1.0,
    yesPrice: 0.0058,
    noPrice: 0.0042,
    totalShares: 240,
    yesShares: 140,
    noShares: 100,
    participants: 67,
    isHot: false,
  },
  {
    id: '6',
    title: 'Will Solana flip BNB by market cap in 2026?',
    description: 'Solana vs BNB market cap prediction based on ecosystem growth, DeFi TVL, and institutional adoption trends.',
    summary: 'This market predicts whether Solana will surpass BNB in total market capitalization at any point during 2026.\n\nIf YES wins: Solana would overtake BNB to become a top-3 cryptocurrency by market cap. This could be driven by Solana\'s superior transaction speed and lower fees attracting more developers and users, explosive growth in Solana DeFi and NFT ecosystems, institutional adoption through products like Solana ETFs or corporate integrations, and successful resolution of past network stability issues. Major DApp migrations to Solana, mobile phone adoption (Saga), and improved validator decentralization could accelerate this flip.\n\nIf NO wins: BNB would maintain its market cap advantage over Solana throughout 2026. This could result from Binance exchange continuing to drive BNB utility and burn mechanisms, BNB Chain (BSC) maintaining its DeFi dominance in emerging markets, Solana experiencing network outages or technical setbacks, regulatory advantages favoring Binance\'s established ecosystem, or broader crypto market conditions favoring established chains. BNB\'s deflationary tokenomics and exchange integration provide structural advantages that could prove difficult to overcome.',
    category: 'crypto',
    status: 'active',
    createdAt: Date.now() - 86400000 * 1,
    expiresAt: Date.now() + 86400000 * 365, // 1 year (Oct 2026)
    creator: '0xSOL...Flip',
    totalPool: 2.9,
    yesPool: 1.6,
    noPool: 1.3,
    yesPrice: 0.0055,
    noPrice: 0.0045,
    totalShares: 290,
    yesShares: 160,
    noShares: 130,
    participants: 73,
    isHot: true,
  },
  {
    id: '7',
    title: 'Will Lakers win NBA Championship 2025-2026?',
    description: 'NBA Finals prediction for the 2025-2026 season with LeBron James and Anthony Davis leading the Lakers.',
    summary: 'This prediction market focuses on whether the Los Angeles Lakers will win the 2025-2026 NBA Championship.\n\nIf YES wins: The Lakers would capture their 18th NBA championship. Success would require Anthony Davis staying healthy and playing at an MVP level throughout the playoffs, LeBron James (age 41) maintaining effectiveness in a reduced role, and the supporting cast (Austin Reaves, Rui Hachimura, etc.) elevating their play in crucial moments. The Lakers would need to navigate a tough Western Conference, potentially facing teams like Denver, Phoenix, or Dallas, then defeat an elite Eastern Conference champion. Strong coaching, playoff experience, and clutch performances would be essential.\n\nIf NO wins: The Lakers would fall short of a championship. This could result from age-related decline in LeBron\'s performance, Anthony Davis suffering playoff injuries (recurring issue), insufficient roster depth to compete with younger, deeper teams, or simply being outmatched by superior opponents like defending champions or emerging contenders. The Western Conference gauntlet, inconsistent three-point shooting, or defensive vulnerabilities could also derail a championship run. Roster construction gaps and competitive balance in the NBA make championships extremely difficult to win.',
    category: 'sports',
    status: 'active',
    createdAt: Date.now() - 86400000 * 6,
    expiresAt: Date.now() + 86400000 * 240, // ~8 months (June 2026)
    creator: '0xLake...rs26',
    totalPool: 1.9,
    yesPool: 1.0,
    noPool: 0.9,
    yesPrice: 0.0053,
    noPrice: 0.0047,
    totalShares: 190,
    yesShares: 100,
    noShares: 90,
    participants: 51,
    isHot: false,
  },
  {
    id: '8',
    title: 'Will AI tokens reach $200B market cap by end of 2026?',
    description: 'AI cryptocurrency sector growth prediction including major AI tokens and emerging projects in the AI x Crypto space.',
    summary: 'This market predicts whether the combined market capitalization of AI-focused cryptocurrency tokens will exceed $200 billion by December 31, 2026.\n\nIf YES wins: The AI crypto sector would need to grow substantially from current levels. This could be driven by breakthroughs in decentralized AI compute networks (Render, Akash), successful AI agent ecosystems built on blockchain, major tech companies integrating AI tokens for compute payments, and speculation around AI narrative driving retail and institutional investment. Projects combining AI training, inference, and data marketplaces on-chain could see explosive adoption. Real-world AI applications generating revenue and token utility would be critical drivers.\n\nIf NO wins: AI crypto tokens would remain below $200B combined market cap through 2026. This could result from AI hype cycle cooling after initial speculation, centralized AI solutions (OpenAI, Google, Anthropic) maintaining dominance without blockchain integration, technical limitations preventing practical decentralized AI applications, regulatory scrutiny around AI token offerings, or broader crypto market downturn limiting capital inflows. Many AI tokens could prove to be speculative with limited real-world utility, leading to valuation corrections.',
    category: 'technology',
    status: 'active',
    createdAt: Date.now() - 86400000 * 3,
    expiresAt: Date.now() + 86400000 * 440, // ~14 months (End of 2026)
    creator: '0xAI26...200B',
    totalPool: 3.3,
    yesPool: 2.0,
    noPool: 1.3,
    yesPrice: 0.0061,
    noPrice: 0.0039,
    totalShares: 330,
    yesShares: 200,
    noShares: 130,
    participants: 89,
    isHot: true,
  },
  {
    id: '9',
    title: 'Will US approve Bitcoin Reserve Act by mid-2026?',
    description: 'Political prediction on US Bitcoin Strategic Reserve legislation following the 2024 election and pro-crypto policies.',
    summary: 'This prediction market focuses on whether the United States will pass legislation creating a Bitcoin Strategic Reserve by June 30, 2026.\n\nIf YES wins: The US would officially hold Bitcoin as a strategic reserve asset alongside gold and foreign currencies. This could happen if pro-crypto elected officials successfully pass legislation, growing concerns about dollar dominance drive diversification strategies, other nations adopting Bitcoin reserves creates competitive pressure, and lobbying from crypto industry and Bitcoin advocates gains political traction. Bipartisan support could emerge around financial innovation and maintaining US competitiveness in digital assets. The bill could include provisions for Treasury to acquire and hold Bitcoin long-term.\n\nIf NO wins: No Bitcoin Reserve Act would be passed by mid-2026. This could result from political gridlock and partisan divisions preventing passage, Federal Reserve and Treasury opposition citing volatility and monetary policy concerns, traditional finance lobby resistance, competing legislative priorities taking precedence, or insufficient Congressional support despite vocal advocacy. Constitutional questions about reserve asset selection, concerns about legitimizing cryptocurrency, or macroeconomic stability concerns could derail the legislation. The political will and consensus necessary for such significant policy change may simply not materialize in this timeframe.',
    category: 'politics',
    status: 'active',
    createdAt: Date.now() - 86400000 * 7,
    expiresAt: Date.now() + 86400000 * 240, // ~8 months (June 2026)
    creator: '0xUSA...BTC',
    totalPool: 4.2,
    yesPool: 2.5,
    noPool: 1.7,
    yesPrice: 0.006,
    noPrice: 0.004,
    totalShares: 420,
    yesShares: 250,
    noShares: 170,
    participants: 98,
    isHot: true,
  },
  {
    id: '10',
    title: 'Will tokenized RWAs exceed $2T market cap by 2026?',
    description: 'Real-world asset tokenization prediction including real estate, bonds, stocks, and commodities on blockchain rails.',
    summary: 'This market predicts whether tokenized real-world assets (RWAs) will exceed $2 trillion in total value by December 31, 2026.\n\nIf YES wins: Tokenized RWAs would experience explosive growth from current levels under $50B. This could be driven by major financial institutions (BlackRock, Fidelity, JPMorgan) massively scaling tokenized treasury and bond offerings, real estate tokenization platforms achieving mainstream adoption enabling fractional property ownership, regulatory clarity providing legal framework for tokenized securities, and efficiency gains and 24/7 settlement attracting traditional finance migration. Corporate bonds, private equity, commodities, and alternative assets moving on-chain would accelerate this growth. Institutional demand for yield-bearing on-chain assets could be the primary driver.\n\nIf NO wins: Tokenized RWAs would remain below $2T through 2026. This could result from regulatory uncertainty and compliance challenges slowing institutional adoption, technical and custody infrastructure remaining immature, limited investor demand outside crypto-native participants, traditional finance systems proving sufficient for current needs without blockchain disruption, or liquidity fragmentation across chains limiting network effects. Legal complexity around asset ownership, jurisdiction, and enforcement could also slow adoption. The $2T target may simply be too ambitious for the timeline given conservative institutional adoption patterns.',
    category: 'finance',
    status: 'active',
    createdAt: Date.now() - 86400000 * 8,
    expiresAt: Date.now() + 86400000 * 440, // ~14 months (End of 2026)
    creator: '0xRWA2...Tril',
    totalPool: 3.1,
    yesPool: 1.8,
    noPool: 1.3,
    yesPrice: 0.0058,
    noPrice: 0.0042,
    totalShares: 310,
    yesShares: 180,
    noShares: 130,
    participants: 76,
    isHot: false,
  },
];

export default function HomePage() {
  const { t } = useI18n();
  const { authenticated } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userBets, setUserBets] = useState<{ [predictionId: string]: { outcome: 'yes' | 'no'; shares: number } }>({});

  const filteredPredictions = predictions.filter(prediction => {
    if (filters.status && prediction.status !== filters.status) return false;
    if (filters.category && prediction.category !== filters.category) return false;
    if (filters.isHot && !prediction.isHot) return false;
    if (filters.timeRange) {
      const now = Date.now();
      const timeRanges = {
        '24h': 86400000,
        '7d': 86400000 * 7,
        '30d': 86400000 * 30,
      };
      const timeRange = timeRanges[filters.timeRange as keyof typeof timeRanges];
      if (timeRange && prediction.createdAt < now - timeRange) return false;
    }
    return true;
  });

  const handleBet = async (predictionId: string, outcome: 'yes' | 'no') => {
    if (!authenticated) {
      alert('Please connect your wallet to place a bet');
      return;
    }
    
    // Mock bet placement
    const prediction = predictions.find(p => p.id === predictionId);
    if (!prediction) return;

    const betAmount = 0.01; // Mock amount
    const shares = betAmount / (outcome === 'yes' ? prediction.yesPrice : prediction.noPrice);
    
    setUserBets(prev => ({
      ...prev,
      [predictionId]: { outcome, shares }
    }));

    // Update prediction pools
    setPredictions(prev => prev.map(p => {
      if (p.id === predictionId) {
        const newYesPool = outcome === 'yes' ? p.yesPool + betAmount : p.yesPool;
        const newNoPool = outcome === 'no' ? p.noPool + betAmount : p.noPool;
        const newTotalPool = newYesPool + newNoPool;
        const newYesPrice = newTotalPool > 0 ? newYesPool / newTotalPool * 0.01 : 0.005;
        const newNoPrice = newTotalPool > 0 ? newNoPool / newTotalPool * 0.01 : 0.005;
        
        return {
          ...p,
          totalPool: newTotalPool,
          yesPool: newYesPool,
          noPool: newNoPool,
          yesPrice: newYesPrice,
          noPrice: newNoPrice,
          participants: p.participants + 1,
        };
      }
      return p;
    }));
  };

  const handleCreatePrediction = async (data: CreatePredictionData) => {
    if (!authenticated) {
      alert('Please connect your wallet to create a prediction');
      return;
    }

    // If a vault is configured and a wallet client is available, attempt to send value
    try {
      const vault = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS;
      if (vault && sendTransaction) {
        const wei = BigInt(Math.round(data.bnbAmount * 1e18));
        await sendTransaction({
          to: vault as `0x${string}`,
          value: wei,
        });
      }
    } catch (err: any) {
      console.error('Create bet transaction failed', err);
      alert('Transaction failed. Please try again.');
      return;
    }

    // Add mock prediction locally
    const newPrediction: Prediction = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      summary: data.summary, // Include the AI-generated summary
      category: data.category,
      status: 'active',
      createdAt: Date.now(),
      expiresAt: data.expiresAt,
      creator: '0x1234...5678', // Mock creator address
      totalPool: data.bnbAmount,
      yesPool: data.userPrediction === 'yes' ? data.bnbAmount : 0,
      noPool: data.userPrediction === 'no' ? data.bnbAmount : 0,
      yesPrice: data.userPrediction === 'yes' ? 0.01 : 0,
      noPrice: data.userPrediction === 'no' ? 0.01 : 0,
      totalShares: data.bnbAmount / 0.01,
      yesShares: data.userPrediction === 'yes' ? data.bnbAmount / 0.01 : 0,
      noShares: data.userPrediction === 'no' ? data.bnbAmount / 0.01 : 0,
      participants: 1,
      isHot: false,
    };

    setPredictions(prev => [newPrediction, ...prev]);
    setShowCreateModal(false);
    alert('Prediction created successfully!');
  };

  const stats = {
    totalPredictions: predictions.length,
    activePredictions: predictions.filter(p => p.status === 'active').length,
    totalVolume: predictions.reduce((sum, p) => sum + p.totalPool, 0),
    totalParticipants: 56,
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      <style jsx>{`
        @keyframes riseUp {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
        .dust-particle {
          position: absolute;
          background-color: #000000;
          border-radius: 50%;
          animation: riseUp linear infinite;
        }
        
        @keyframes boldPulse {
          0%, 100% {
            transform: scale(1);
            text-shadow: 0 0 20px rgba(0, 0, 0, 0.3),
                         0 0 40px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.05);
            text-shadow: 0 0 30px rgba(0, 0, 0, 0.5),
                         0 0 60px rgba(0, 0, 0, 0.3),
                         0 0 80px rgba(0, 0, 0, 0.2);
          }
        }
        
        @keyframes slideInScale {
          0% {
            transform: translateY(-20px) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes greenGlow {
          0%, 100% {
            box-shadow: 0 0 10px 3px #00FF00, 0 0 20px 5px #00FF00, inset 0 0 10px rgba(0, 255, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 20px 5px #00FF00, 0 0 40px 10px #00FF00, inset 0 0 20px rgba(0, 255, 0, 0.5);
          }
        }
        
        .rotating-border-btn,
        button.rotating-border-btn {
          border: 5px solid #00FF00 !important;
          outline: 3px solid #00FF00 !important;
          outline-offset: 3px !important;
          animation: greenGlow 1.5s ease-in-out infinite !important;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease !important;
        }
        
        .rotating-border-btn:hover,
        button.rotating-border-btn:hover {
          transform: scale(1.06) !important;
          background: #111111 !important;
          box-shadow: 0 0 35px 10px #00FF00, 0 0 70px 18px #00FF00, inset 0 0 35px rgba(0, 255, 0, 0.65) !important;
        }
        
        .bold-title {
          animation: slideInScale 0.8s ease-out, boldPulse 3s ease-in-out infinite;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        /* Neon green (brighter) border wrapper */
        @keyframes neonPulse {
          0%, 100% {
            box-shadow: 0 0 10px #39FF14, 0 0 22px rgba(57,255,20,0.5);
          }
          50% {
            box-shadow: 0 0 16px #39FF14, 0 0 30px rgba(57,255,20,0.65);
          }
        }
        .neon-border {
          position: relative;
          display: inline-block;
        }
        .neon-border::before {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border-radius: 0.75rem; /* match/extend button rounding */
          border: 3px solid #39FF14; /* toned-down neon green */
          box-shadow: 0 0 12px #39FF14, 0 0 24px rgba(57,255,20,0.55);
          pointer-events: none;
          animation: neonPulse 2.2s ease-in-out infinite;
          transition: box-shadow 160ms ease;
        }
        .neon-border:hover::before {
          box-shadow: 0 0 18px #39FF14, 0 0 36px rgba(57,255,20,0.75);
        }
      `}</style>
      
      {/* Rising dust on left side */}
      <div className="fixed left-0 top-0 bottom-0 w-64 pointer-events-none z-[1] overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`left-${i}`}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      
      {/* Rising dust on right side */}
      <div className="fixed right-0 top-0 bottom-0 w-64 pointer-events-none z-[1] overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`right-${i}`}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>
      
      {/* Hero Section - Betting Style */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bnb-pattern opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl bold-title text-black">
              {t('live_markets')}
              </h1>
            <p className="mt-4 text-lg leading-8 text-black max-w-2xl mx-auto animate-fade-in">
              {t('hero_subtitle')}
            </p>
            
             {/* Quick Stats Bar */}
             <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
               <div className="flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full border border-black">
                 <Flame className="h-4 w-4 text-yellow-400" />
                 <span className="text-white font-medium">{stats.activePredictions} Live Markets</span>
               </div>
               <div className="flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full border border-black">
                 <TrendingUp className="h-4 w-4 text-green-400" />
                 <span className="text-white font-medium">{stats.totalVolume.toFixed(2)} BNB Volume</span>
               </div>
               <div className="flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full border border-black">
                 <Users className="h-4 w-4 text-blue-400" />
                 <span className="text-white font-medium">{stats.totalParticipants} Players</span>
               </div>
             </div>

            {/* Dark Pools Feature Card */}
            <div className="mt-8 max-w-4xl mx-auto">
              <Card className="border-black bg-black/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Eye className="h-6 w-6 text-yellow-400" />
                    <h2 className="text-xl font-semibold text-white">
                      {t('dark_pools_title')}
                    </h2>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-center mb-6">
                    {t('dark_pools_description')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-yellow-400/20 border border-yellow-400/30">
                      <Lock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white mb-1">{t('privacy')}</div>
                      <div className="text-xs text-gray-200">{t('privacy_description')}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-400/20 border border-yellow-400/30">
                      <Shield className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white mb-1">{t('anti_manipulation')}</div>
                      <div className="text-xs text-gray-200">{t('anti_manipulation_description')}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-400/20 border border-yellow-400/30">
                      <Users className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-white mb-1">{t('clean_slate')}</div>
                      <div className="text-xs text-gray-200">{t('clean_slate_description')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

             {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <div className="neon-border">
              <Button
                size="lg"
                onClick={() => setShowCreateModal(true)}
                  className="bg-black hover:bg-black/90 text-white text-lg px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                  Make a Prediction
                </Button>
              </div>
               <Button
                 variant="outline"
                 size="lg"
                 className="border-black bg-black/90 text-white hover:bg-black text-lg px-8 py-3"
               >
                 <BarChart3 className="h-5 w-5 mr-2" />
                 View Markets
              </Button>
              {!authenticated && (
                <p className="text-sm text-black font-medium mt-2">
                  {t('connect_to_create')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-6 relative z-10">
        <Card className="bg-black/90 border-black">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                   <Star className="h-6 w-6 text-black" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-white">New to DarkBet?</h3>
                   <p className="text-gray-200 text-sm">Get started with our AI-powered prediction markets</p>
                 </div>
                </div>
              <div className="flex items-center gap-3">
                 <Button
                   variant="outline"
                   size="sm"
                   className="border-white bg-white/10 text-white hover:bg-white hover:text-black"
                 >
                   Learn More
                 </Button>
                 <Button
                   size="sm"
                   className="bg-white hover:bg-gray-200 text-black"
                   onClick={() => setShowCreateModal(true)}
                 >
                   Start Betting
                 </Button>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Quick Stats Bar */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <Card className="border-black bg-black/90">
             <CardContent className="p-4 text-center">
               <div className="text-2xl font-bold text-white">{stats.activePredictions}</div>
               <div className="text-sm text-gray-200">Live Markets</div>
             </CardContent>
           </Card>
           <Card className="border-black bg-black/90">
             <CardContent className="p-4 text-center">
               <div className="text-2xl font-bold text-white">{stats.totalVolume.toFixed(1)}</div>
               <div className="text-sm text-gray-200">BNB Volume</div>
             </CardContent>
           </Card>
           <Card className="border-black bg-black/90">
             <CardContent className="p-4 text-center">
               <div className="text-2xl font-bold text-white">{stats.totalParticipants}</div>
               <div className="text-sm text-gray-200">Active Players</div>
             </CardContent>
           </Card>
           <Card className="border-black bg-black/90">
             <CardContent className="p-4 text-center">
               <div className="text-2xl font-bold text-white">{stats.totalPredictions}</div>
               <div className="text-sm text-gray-200">Total Markets</div>
             </CardContent>
           </Card>
        </div>
      </div>

      {/* Featured Markets Section - Betting Style */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <Trophy className="h-6 w-6 text-black" />
             <h2 className="text-2xl font-bold text-black">Featured Markets</h2>
             <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full">
               <Flame className="h-3 w-3 text-white" />
               <span className="text-xs text-white font-medium">HOT</span>
             </div>
           </div>
           <Button
             variant="outline"
             size="sm"
             className="border-black bg-black/90 text-white hover:bg-black"
           >
             View All
           </Button>
        </div>

        {/* Featured Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredPredictions.slice(0, 3).map((prediction, index) => (
             <Card 
               key={prediction.id} 
               className={cn(
                 "relative overflow-hidden border-black bg-black/90 hover:bg-black transition-all duration-300",
                 prediction.isHot && "ring-2 ring-yellow-400"
               )}
             >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Badge 
                         variant="outline" 
                         className="text-xs border-white text-white"
                       >
                         {prediction.category}
                       </Badge>
                       {prediction.isHot && (
                         <Badge variant="warning" className="text-xs animate-pulse">
                           <Flame className="h-3 w-3 mr-1" />
                           HOT
                         </Badge>
                       )}
                     </div>
                     <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">
                       {prediction.title}
                     </h3>
                   </div>
                   <div className="text-right">
                     <div className="text-xs text-gray-300">Pool</div>
                     <div className="text-sm font-bold text-white">
                       {prediction.totalPool.toFixed(2)} BNB
                </div>
                </div>
              </div>

                 {/* Odds Display - Betting Style */}
                 <div className="grid grid-cols-2 gap-2 mb-3">
                   <div className="bg-green-600 border border-green-700 rounded-lg p-3 text-center">
                     <div className="text-xs text-white mb-1">YES</div>
                     <div className="text-lg font-bold text-white">
                       {prediction.yesPrice.toFixed(3)}
                     </div>
                     <div className="text-xs text-gray-200">
                       {prediction.yesPool.toFixed(2)} BNB
                     </div>
                   </div>
                   <div className="bg-red-600 border border-red-700 rounded-lg p-3 text-center">
                     <div className="text-xs text-white mb-1">NO</div>
                     <div className="text-lg font-bold text-white">
                       {prediction.noPrice.toFixed(3)}
                     </div>
                     <div className="text-xs text-gray-200">
                       {prediction.noPool.toFixed(2)} BNB
                </div>
                </div>
              </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-200 text-black font-semibold"
                    onClick={() => handleBet(prediction.id, 'yes')}
                  >
                    <ArrowUp className="h-3 w-3 mr-1" />
                    YES
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-200 text-black font-semibold"
                    onClick={() => handleBet(prediction.id, 'no')}
                  >
                    <ArrowDown className="h-3 w-3 mr-1" />
                    NO
                  </Button>
                </div>

                 {/* Market Info */}
                 <div className="flex items-center justify-between mt-3 text-xs text-gray-300">
                   <div className="flex items-center gap-1">
                     <Users className="h-3 w-3" />
                     <span>{prediction.participants}</span>
                </div>
                   <div className="flex items-center gap-1">
                     <Clock className="h-3 w-3" />
                     <span>30d left</span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>

      {/* All Markets Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 relative z-10">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-black" />
              <h2 className="text-2xl font-bold text-black">All Markets</h2>
              <Badge variant="outline" className="border-black text-black">
                {filteredPredictions.length} markets
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-black bg-black/90 text-white hover:bg-black"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-black bg-black/90 text-white hover:bg-black"
              >
                <Clock className="h-4 w-4 mr-1" />
                Ending Soon
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={filteredPredictions.length}
          />

           {/* Markets Grid */}
          {filteredPredictions.length === 0 ? (
             <Card className="text-center py-12 border-black bg-black/90">
              <CardContent>
                 <div className="mx-auto w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                   <TrendingUp className="h-12 w-12 text-black" />
                </div>
                 <h3 className="text-lg font-medium text-white mb-2">
                   {t('no_predictions_found')}
                </h3>
                 <p className="text-gray-200 mb-4">
                   {t('try_adjusting_filters')}
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                   className="bg-white hover:bg-gray-200 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                   {t('create_first_prediction')}
                </Button>
              </CardContent>
            </Card>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPredictions.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  onBet={handleBet}
                  userBets={userBets}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Make a Prediction Modal */}
      <CreateBetModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePrediction}
      />
    </div>
  );
}
