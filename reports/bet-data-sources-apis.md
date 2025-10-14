# 📡 Bet Data Sources & API Endpoints

**Purpose:** Reference list of APIs and data sources for creating and resolving prediction markets

**Last Updated:** October 14, 2025

---

## 🎯 Categories

1. [Cryptocurrency & DeFi](#cryptocurrency--defi)
2. [Sports](#sports)
3. [Weather](#weather)
4. [Finance & Economics](#finance--economics)
5. [Politics & Elections](#politics--elections)
6. [Technology & Social](#technology--social)
7. [News & Events](#news--events)

---

## 💰 Cryptocurrency & DeFi

### CoinGecko API
**Free Tier:** 10-50 calls/minute  
**Endpoint:** `https://api.coingecko.com/api/v3`  
**Use Cases:** BTC/ETH/BNB price predictions, market cap predictions

**Useful Endpoints:**
```
GET /simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd
GET /coins/{id}/market_chart?vs_currency=usd&days=365
GET /global - Total crypto market cap
```

**Example Bets:**
- "Will Bitcoin reach $100,000 by end of 2025?"
- "Will Ethereum flip Bitcoin in market cap?"
- "Will total crypto market cap exceed $5 trillion?"

**Website:** https://www.coingecko.com/en/api

---

### CoinMarketCap API
**Free Tier:** 10,000 calls/month  
**Endpoint:** `https://pro-api.coinmarketcap.com/v1`  
**Use Cases:** Crypto rankings, DeFi TVL, token prices

**Useful Endpoints:**
```
GET /cryptocurrency/listings/latest
GET /cryptocurrency/quotes/latest?symbol=BTC,ETH
GET /global-metrics/quotes/latest
```

**Example Bets:**
- "Will BNB be in top 3 by market cap?"
- "Will Solana flip BNB?"
- "Will DeFi TVL exceed $200B?"

**Website:** https://coinmarketcap.com/api/

---

### DeFi Llama API
**Free Tier:** Unlimited (public)  
**Endpoint:** `https://api.llama.fi`  
**Use Cases:** DeFi TVL predictions, protocol rankings

**Useful Endpoints:**
```
GET /protocols - All protocols TVL
GET /tvl/{protocol} - Specific protocol TVL
GET /chains - TVL by chain
```

**Example Bets:**
- "Will Uniswap TVL exceed $10B?"
- "Will BSC DeFi TVL surpass Ethereum?"
- "Will total DeFi TVL reach $500B?"

**Website:** https://defillama.com/

---

### Binance API
**Free Tier:** Rate limited  
**Endpoint:** `https://api.binance.com/api/v3`  
**Use Cases:** BNB price, trading volume, listings

**Useful Endpoints:**
```
GET /ticker/price?symbol=BNBUSDT
GET /ticker/24hr?symbol=BNBUSDT
GET /klines?symbol=BNBUSDT&interval=1d
```

**Example Bets:**
- "Will BNB trading volume exceed $5B in 24h?"
- "Will BNB reach ATH this year?"

**Website:** https://binance-docs.github.io/apidocs/spot/en/

---

## ⚽ Sports

### The Odds API
**Free Tier:** 500 requests/month  
**Endpoint:** `https://api.the-odds-api.com/v4`  
**Use Cases:** Sports betting odds, game outcomes

**Useful Endpoints:**
```
GET /sports - List of sports
GET /sports/{sport}/odds - Live odds
GET /sports/{sport}/scores - Game scores
```

**Example Bets:**
- "Will Manchester City win Premier League?"
- "Will Lakers win NBA Championship?"
- "Will Inter Miami win MLS Cup?"

**Website:** https://the-odds-api.com/

---

### ESPN API (Unofficial)
**Free Tier:** Unlimited (scraping)  
**Endpoint:** `https://site.api.espn.com/apis/site/v2/sports`  
**Use Cases:** Scores, standings, schedules

**Useful Endpoints:**
```
GET /soccer/eng.1/standings - Premier League standings
GET /basketball/nba/standings - NBA standings
GET /football/nfl/scoreboard - NFL scores
```

**Example Bets:**
- "Will [Team] make playoffs?"
- "Will [Player] win MVP?"
- "Will [Team] finish top 4?"

**Website:** https://gist.github.com/nntrn/ee26cb2a0716de0947a0a4e9a157bc1c

---

### SportsRadar API
**Free Trial:** Available  
**Endpoint:** `https://api.sportradar.com`  
**Use Cases:** Comprehensive sports data, live scores

**Useful Endpoints:**
```
GET /soccer/trial/v4/en/tournaments/{id}/standings
GET /basketball/trial/v2/en/tournaments/{id}/standings
```

**Example Bets:**
- Professional sports outcomes
- Tournament winners
- Season standings

**Website:** https://sportradar.com/

---

## 🌤️ Weather

### OpenWeather API
**Free Tier:** 1,000 calls/day  
**Endpoint:** `https://api.openweathermap.org/data/2.5`  
**Use Cases:** Weather predictions, temperature bets

**Useful Endpoints:**
```
GET /weather?q={city} - Current weather
GET /forecast?q={city} - 5 day forecast
GET /onecall?lat={lat}&lon={lon} - Detailed forecast
```

**Example Bets:**
- "Will NYC have snow on Christmas?"
- "Will temperature exceed 100°F in Phoenix in July?"
- "Will hurricane season 2025 have >15 named storms?"

**Website:** https://openweathermap.org/api

---

### Weather.gov API (US)
**Free Tier:** Unlimited  
**Endpoint:** `https://api.weather.gov`  
**Use Cases:** US weather data, forecasts

**Useful Endpoints:**
```
GET /points/{lat},{lon} - Location metadata
GET /gridpoints/{office}/{grid}/{forecast} - Forecast
```

**Example Bets:**
- US-specific weather predictions
- Severe weather events
- Seasonal forecasts

**Website:** https://www.weather.gov/documentation/services-web-api

---

### NOAA Climate API
**Free Tier:** Unlimited  
**Endpoint:** `https://www.ncdc.noaa.gov/cdo-web/api/v2`  
**Use Cases:** Climate data, historical weather

**Useful Endpoints:**
```
GET /datasets - Available datasets
GET /data - Climate data points
```

**Example Bets:**
- "Will 2025 be hottest year on record?"
- "Will Arctic sea ice hit new low?"
- "Will El Niño occur in 2026?"

**Website:** https://www.ncdc.noaa.gov/cdo-web/webservices/v2

---

## 💼 Finance & Economics

### Alpha Vantage
**Free Tier:** 5 calls/minute, 500/day  
**Endpoint:** `https://www.alphavantage.co/query`  
**Use Cases:** Stock prices, forex, crypto

**Useful Endpoints:**
```
GET ?function=GLOBAL_QUOTE&symbol=TSLA
GET ?function=FX_DAILY&from_symbol=EUR&to_symbol=USD
GET ?function=DIGITAL_CURRENCY_DAILY&symbol=BTC
```

**Example Bets:**
- "Will Tesla stock hit $500?"
- "Will S&P 500 reach 6000?"
- "Will EUR/USD parity happen?"

**Website:** https://www.alphavantage.co/

---

### Yahoo Finance API (Unofficial)
**Free Tier:** Rate limited  
**Endpoint:** `https://query1.finance.yahoo.com/v8/finance`  
**Use Cases:** Stock quotes, market data

**Useful Endpoints:**
```
GET /quote?symbols=AAPL,TSLA,MSFT
GET /spark?symbols=AAPL&range=1d
```

**Example Bets:**
- Stock price predictions
- Market index predictions
- Earnings surprises

**Website:** https://github.com/ranaroussi/yfinance

---

### Federal Reserve API (FRED)
**Free Tier:** Unlimited with API key  
**Endpoint:** `https://api.stlouisfed.org/fred`  
**Use Cases:** Economic indicators, interest rates

**Useful Endpoints:**
```
GET /series/observations?series_id=GDP
GET /series/observations?series_id=UNRATE - Unemployment
GET /series/observations?series_id=DFF - Fed Funds Rate
```

**Example Bets:**
- "Will Fed cut rates 3+ times in 2025?"
- "Will unemployment drop below 3%?"
- "Will GDP growth exceed 4%?"

**Website:** https://fred.stlouisfed.org/docs/api/fred/

---

### World Bank API
**Free Tier:** Unlimited  
**Endpoint:** `https://api.worldbank.org/v2`  
**Use Cases:** Global economic data, development indicators

**Useful Endpoints:**
```
GET /countries/usa/indicators/NY.GDP.MKTP.CD
GET /countries/all/indicators/SP.POP.TOTL
```

**Example Bets:**
- Global economic predictions
- Country GDP comparisons
- Population milestones

**Website:** https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

---

## 🏛️ Politics & Elections

### ProPublica Congress API
**Free Tier:** Unlimited  
**Endpoint:** `https://api.propublica.org/congress/v1`  
**Use Cases:** US Congress voting, bills, members

**Useful Endpoints:**
```
GET /members/senate/{state}/current - Senators
GET /bills/search - Search bills
GET /votes/recent - Recent votes
```

**Example Bets:**
- "Will [Bill] pass Congress?"
- "Will [Senator] vote for [Bill]?"
- Congressional outcomes

**Website:** https://projects.propublica.org/api-docs/congress-api/

---

### Ballotpedia API
**Requires Partnership**  
**Use Cases:** Election data, candidates

**Example Bets:**
- Election outcomes
- Primary winners
- Ballot measure results

**Website:** https://ballotpedia.org/

---

### FiveThirtyEight (Scraping)
**Free Tier:** Public data  
**Endpoint:** Scraping or CSV downloads  
**Use Cases:** Election forecasts, poll aggregation

**Example Bets:**
- Presidential election outcomes
- Senate control
- Gubernatorial races

**Website:** https://projects.fivethirtyeight.com/

---

### NewsAPI
**Free Tier:** 100 requests/day  
**Endpoint:** `https://newsapi.org/v2`  
**Use Cases:** Political news, event tracking

**Useful Endpoints:**
```
GET /everything?q=election&language=en
GET /top-headlines?country=us&category=politics
```

**Example Bets:**
- Political event predictions
- Policy announcement timing
- Election news volume

**Website:** https://newsapi.org/

---

## 💻 Technology & Social

### GitHub API
**Free Tier:** 5,000 requests/hour  
**Endpoint:** `https://api.github.com`  
**Use Cases:** Repository stats, trending projects

**Useful Endpoints:**
```
GET /repos/{owner}/{repo} - Repo details
GET /repos/{owner}/{repo}/stargazers - Stars count
GET /search/repositories?q=stars:>10000
```

**Example Bets:**
- "Will [Project] reach 100k stars?"
- "Will [Company] open-source [Project]?"
- Developer adoption predictions

**Website:** https://docs.github.com/en/rest

---

### Reddit API
**Free Tier:** Rate limited  
**Endpoint:** `https://www.reddit.com/r/{subreddit}.json`  
**Use Cases:** Community sentiment, trending topics

**Useful Endpoints:**
```
GET /r/cryptocurrency.json - Crypto subreddit
GET /r/all/top.json - Top posts
```

**Example Bets:**
- Community sentiment predictions
- Viral post predictions
- Subreddit growth

**Website:** https://www.reddit.com/dev/api/

---

### Twitter/X API
**Free Tier:** Limited  
**Endpoint:** `https://api.twitter.com/2`  
**Use Cases:** Social trends, engagement metrics

**Useful Endpoints:**
```
GET /tweets/search/recent
GET /users/{id}/tweets
```

**Example Bets:**
- Viral tweet predictions
- Follower count milestones
- Trending topic predictions

**Website:** https://developer.twitter.com/en/docs/twitter-api

---

### Google Trends (Unofficial API)
**Free Tier:** Via pytrends  
**Use Cases:** Search trends, interest over time

**Example Bets:**
- "Will [Topic] trend in 2025?"
- Search interest predictions
- Seasonal trend predictions

**Website:** https://trends.google.com/

---

## 📰 News & Events

### NewsAPI
**Free Tier:** 100 requests/day  
**Endpoint:** `https://newsapi.org/v2`  
**Use Cases:** Breaking news, event verification

**Useful Endpoints:**
```
GET /everything?q={query}&sortBy=publishedAt
GET /top-headlines?country=us&category=business
```

**Example Bets:**
- Event occurrence predictions
- News volume predictions
- Media coverage bets

**Website:** https://newsapi.org/

---

### Event Registry
**Free Trial:** Available  
**Endpoint:** `https://eventregistry.org/api/v1`  
**Use Cases:** Global events, news analysis

**Example Bets:**
- Major event predictions
- Geopolitical predictions
- Natural disaster predictions

**Website:** https://eventregistry.org/

---

### Wikimedia API
**Free Tier:** Unlimited  
**Endpoint:** `https://en.wikipedia.org/w/api.php`  
**Use Cases:** Article views, trending topics

**Useful Endpoints:**
```
GET ?action=query&list=mostviewed
GET ?action=query&titles={title}
```

**Example Bets:**
- Wikipedia pageview predictions
- Article creation bets
- Notable events verification

**Website:** https://www.mediawiki.org/wiki/API:Main_page

---

## 🎬 Entertainment & Pop Culture

### TMDb API (The Movie Database)
**Free Tier:** Good rate limits  
**Endpoint:** `https://api.themoviedb.org/3`  
**Use Cases:** Movie releases, box office

**Useful Endpoints:**
```
GET /movie/upcoming
GET /movie/{id}/box_office
GET /trending/movie/week
```

**Example Bets:**
- "Will [Movie] gross $1B?"
- "Will [Actor] win Oscar?"
- Box office predictions

**Website:** https://developers.themoviedb.org/

---

### Spotify API
**Free Tier:** Available  
**Endpoint:** `https://api.spotify.com/v1`  
**Use Cases:** Music charts, artist metrics

**Useful Endpoints:**
```
GET /artists/{id} - Artist info
GET /playlists/{id}/tracks
GET /charts - Charts data
```

**Example Bets:**
- "Will [Song] hit #1 on Spotify?"
- "Will [Artist] release album in 2025?"
- Streaming milestone predictions

**Website:** https://developer.spotify.com/documentation/web-api

---

### IMDb Unofficial APIs
**Various Sources**  
**Use Cases:** Movie ratings, reviews

**Example Bets:**
- IMDb rating predictions
- Movie release date bets
- Award prediction markets

---

## 🏆 Blockchain-Specific Data

### BSCScan API
**Free Tier:** 5 calls/second  
**Endpoint:** `https://api.bscscan.com/api`  
**Use Cases:** BNB Chain transactions, contracts

**Useful Endpoints:**
```
GET ?module=stats&action=bnbprice
GET ?module=stats&action=bnbsupply
GET ?module=account&action=balance&address={addr}
```

**Example Bets:**
- "Will BSC daily transactions exceed 10M?"
- "Will BNB burn exceed X amount?"
- Smart contract deployment predictions

**Website:** https://bscscan.com/apis

---

### Etherscan API
**Free Tier:** 5 calls/second  
**Endpoint:** `https://api.etherscan.io/api`  
**Use Cases:** Ethereum data, gas prices

**Useful Endpoints:**
```
GET ?module=stats&action=ethprice
GET ?module=gastracker&action=gasoracle
GET ?module=stats&action=ethsupply
```

**Example Bets:**
- "Will ETH gas average below 20 gwei?"
- "Will Ethereum supply become deflationary?"
- DApp usage predictions

**Website:** https://etherscan.io/apis

---

## 🎲 Prediction Market Specific

### Polymarket API (Unofficial)
**Free Tier:** Via CLOB API  
**Endpoint:** `https://clob.polymarket.com`  
**Use Cases:** Prediction market outcomes, odds

**Example Bets:**
- Cross-platform arbitrage
- Market sentiment analysis
- Odds comparison

**Website:** https://docs.polymarket.com/

---

### Augur (Ethereum)
**Blockchain-based**  
**Use Cases:** Decentralized prediction market data

**Example Bets:**
- Compare with centralized markets
- Oracle resolution verification

**Website:** https://augur.net/

---

## 🛠️ Aggregators & Multi-Purpose

### RapidAPI
**Free Tier:** Varies by API  
**Endpoint:** Various  
**Use Cases:** Access to 1000s of APIs

**Categories:**
- Sports
- Finance
- Weather
- News
- Entertainment

**Website:** https://rapidapi.com/

---

### The Guardian API
**Free Tier:** Available  
**Endpoint:** `https://content.guardianapis.com`  
**Use Cases:** News articles, event verification

**Useful Endpoints:**
```
GET /search?q={query}&section=sport
GET /search?q={query}&section=politics
```

**Example Bets:**
- Event verification
- News volume predictions

**Website:** https://open-platform.theguardian.com/

---

## 📊 How to Use These APIs for Bets

### 1. **Market Creation**
Use APIs to generate market ideas:
- Pull trending topics from Twitter/Reddit
- Get upcoming sports matches from Odds API
- Find crypto price milestones from CoinGecko

### 2. **Resolution Verification**
Use APIs as oracle data sources:
- CoinGecko for price verification
- ESPN for sports scores
- OpenWeather for weather outcomes
- Yahoo Finance for stock prices

### 3. **Automated Market Creation**
Build a bot that:
1. Queries multiple APIs for upcoming events
2. Uses AI to generate market descriptions
3. Automatically creates markets via smart contract
4. Sets appropriate expiration dates

### 4. **Resolution Bot**
Build an oracle that:
1. Monitors expired markets
2. Queries relevant API for outcome data
3. Calls `resolveMarket()` with verified data
4. Provides reasoning from API source

---

## 🔐 Best Practices

### API Key Management
- Store keys in `.env` file
- Never commit keys to git
- Use separate keys for dev/prod
- Monitor API usage/limits

### Rate Limiting
- Implement exponential backoff
- Cache responses when possible
- Use webhooks instead of polling
- Respect API rate limits

### Data Reliability
- Use multiple sources for verification
- Implement fallback APIs
- Validate data before using
- Log all API responses

### Oracle Implementation
```typescript
// Example oracle function
async function resolveMarket(marketId: number, apiSource: string) {
  try {
    // 1. Fetch data from API
    const data = await fetchFromAPI(apiSource);
    
    // 2. Verify data quality
    if (!isDataValid(data)) throw new Error('Invalid data');
    
    // 3. Determine outcome
    const outcome = determineOutcome(data);
    
    // 4. Call smart contract
    await predictionMarket.resolveMarket(
      marketId,
      outcome,
      `Resolved using ${apiSource}: ${data.source}`
    );
    
    return true;
  } catch (error) {
    console.error('Resolution failed:', error);
    return false;
  }
}
```

---

## 🎯 Recommended API Combinations by Category

### Crypto Markets
- **Primary:** CoinGecko (price data)
- **Secondary:** DeFi Llama (TVL data)
- **Verification:** CoinMarketCap (cross-check)

### Sports Markets
- **Primary:** The Odds API (odds + scores)
- **Secondary:** ESPN API (detailed stats)
- **Verification:** SportsRadar (official data)

### Weather Markets
- **Primary:** OpenWeather (forecasts)
- **Secondary:** Weather.gov (US data)
- **Verification:** NOAA (historical/climate)

### Financial Markets
- **Primary:** Alpha Vantage (stocks)
- **Secondary:** Yahoo Finance (real-time)
- **Verification:** FRED (economic data)

### Political Markets
- **Primary:** ProPublica (Congress)
- **Secondary:** NewsAPI (events)
- **Verification:** Official government sources

---

## 💡 Market Ideas Generator

### Use AI + APIs:
```typescript
async function generateMarketIdeas() {
  // 1. Get trending topics
  const trending = await fetch('https://api.twitter.com/2/trends/place');
  
  // 2. Get upcoming events
  const sports = await fetch('https://api.the-odds-api.com/v4/sports/upcoming');
  
  // 3. Get crypto milestones
  const crypto = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
  
  // 4. Use AI to generate market descriptions
  const markets = await aiService.generateMarkets({
    trending,
    sports,
    crypto
  });
  
  return markets;
}
```

---

## 📞 Support Resources

### API Documentation
- Each API has detailed docs (see links above)
- Most have SDKs/libraries available
- Community support on GitHub/Discord

### Testing
- Use Postman for API testing
- Test API reliability before using in production
- Monitor API uptime/status pages

### Alternatives
- Always have backup APIs
- Use free tiers for testing
- Upgrade to paid plans for production

---

## ✅ Quick Start Checklist

For each market category you want to support:

- [ ] Choose primary API
- [ ] Get API key
- [ ] Test endpoints
- [ ] Implement data fetching
- [ ] Add error handling
- [ ] Set up caching
- [ ] Build resolution logic
- [ ] Test with real data
- [ ] Deploy oracle bot

---

**Status:** ✅ Complete API Reference  
**Last Updated:** October 14, 2025  
**Total APIs Listed:** 35+  
**Categories Covered:** 9

---

**Pro Tip:** Start with free tier APIs and scale to paid plans as your platform grows. Always have fallback data sources for critical market resolution!

