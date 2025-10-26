# Video Demo Script for Hackathon Submission

> **Target Length**: 3-5 minutes  
> **Format**: Screen recording with voiceover  
> **Purpose**: Demonstrate PredictX solving the cross-platform responsible gambling problem

---

## 🎬 Script Structure

### Opening (30 seconds)

**[Visual: Title slide with PredictX logo]**

**Voiceover:**

> "Hi, I'm [Your Name], and I'm excited to present **PredictX** — a cross-platform responsible gambling registry built for the Encode Hackathon 2025, Concordium Responsible Gambling track.
>
> PredictX solves a critical problem in online gambling: existing safeguards are fragmented and reactive. Today, I'll show you how PredictX provides true cross-platform protection that actually prevents addiction."

**[Transition to problem slide]**

---

### Problem Statement (45 seconds)

**[Visual: Animation showing user jumping between platforms]**

**Voiceover:**

> "Here's the problem with current responsible gambling systems:
>
> [Show Casino A] Sarah sets a €100 daily limit on Casino A to control her gambling.
>
> [Show Sarah hitting limit] She reaches her €100 limit and Casino A blocks further bets. Good, right?
>
> [Show Casino B] But then Sarah just goes to Casino B, which has no idea about her limits at Casino A.
>
> [Show more money lost] She loses another €100 there. Then Casino C, another €100.
>
> [Show total: €300] In one day, Sarah has lost €300, not €100. Her limit was completely ineffective because it only worked on one platform.
>
> **This is the problem PredictX solves.**"

**[Transition to solution slide]**

---

### Solution Overview (30 seconds)

**[Visual: PredictX architecture diagram]**

**Voiceover:**

> "PredictX is a cross-platform responsible gambling registry built on Concordium blockchain.
>
> Using Concordium's Web3 ID and anonymous identity commitments, PredictX creates a **single source of truth** for responsible gambling limits that works across **every gambling platform**.
>
> When Sarah sets a €100 daily limit in PredictX, it applies to Casino A, Casino B, Casino C — **everywhere**. No platform can bypass it."

**[Transition to live demo]**

---

### Live Demo Part 1: User Registration (1 minute)

**[Visual: Screen recording of PredictX demo site]**

**Voiceover:**

> "Let me show you how it works. I'm going to register as a new user on this prediction market — which is our example gambling platform demonstrating the integration.
>
> [Click 'Connect Wallet'] First, I connect my Concordium wallet.
>
> [Identity verification modal appears] Since this is my first time, I need to complete identity verification using Concordium's Web3 ID.
>
> [Show verification process] The system verifies my age and jurisdiction using zero-knowledge proofs — proving I'm over 18 without revealing my exact age. My real identity stays private.
>
> [Registration complete] Perfect! I'm now registered. Behind the scenes, PredictX generated an anonymous identity commitment — a Blake2b hash — that's unique to me but reveals no personal information.
>
> [Show default limits] I've been assigned default limits: €100 per day, €500 per week, €2000 per month. Let me customize these."

**[Show limit configuration]**

> "I'm going to set a €50 daily limit to be extra cautious.
>
> [Save limits] Done. Now let's test the system."

---

### Live Demo Part 2: Normal Bet (30 seconds)

**[Visual: Placing a bet within limits]**

**Voiceover:**

> "I'm going to place a €30 bet on this market.
>
> [Enter amount] €30... 
>
> [Click 'Place Bet'] Before accepting my bet, the platform calls the PredictX API to check if it's allowed.
>
> [Show API call in network tab] See this? `POST /api/rg/check` — checking my limits in real-time.
>
> [Bet successful] ✅ Approved! I'm at €30 of my €50 daily limit. The bet goes through normally."

---

### Live Demo Part 3: Limit Exceeded (30 seconds)

**[Visual: Attempting bet that exceeds limits]**

**Voiceover:**

> "Now let's try to place a €30 bet again.
>
> [Enter €30] 
>
> [Click 'Place Bet'] The system checks...
>
> [Error message appears] ❌ Blocked! 'Would exceed daily limit (€30/€50 used)'
>
> [Highlight error] The platform won't let me place this bet because it would take me over my €50 limit. The blockchain is enforcing my limit — I can't bypass it."

---

### Live Demo Part 4: Cross-Platform Enforcement (1 minute) 🌟 **KEY DEMO**

**[Visual: Open "different platform" in new tab]**

**Voiceover:**

> "Here's where PredictX shines — **cross-platform enforcement**.
>
> [Show tab labeled 'Casino B'] Imagine this is a completely different gambling platform — Casino B, if you will.
>
> [Same user logs in] I log in with the same Concordium wallet. Behind the scenes, it generates the **same identity commitment** because it's based on my wallet address.
>
> [Check RG status] Look at my RG status here on 'Casino B' — it shows I've already spent €30 today!
>
> [Try to place €30 bet] Let me try to place another €30 bet here...
>
> [Blocked again] ❌ Blocked! 'Would exceed daily limit (€30/€50 used)'
>
> **This is the game-changer.** Even though this is a completely different platform, operated by a completely different company, my limits still apply! 
>
> [Emphasize] In traditional systems, each platform has its own limits. With PredictX, limits follow the user **everywhere**."

---

### Live Demo Part 5: Self-Exclusion (30 seconds)

**[Visual: Self-exclusion feature]**

**Voiceover:**

> "PredictX also supports self-exclusion. 
>
> [Click 'Self-Exclude'] If I realize I have a problem, I can exclude myself from all gambling for a set period.
>
> [Select 30 days] Let's say 30 days...
>
> [Confirm] This is irreversible for 30 days — even I can't undo it.
>
> [Try to bet] Now if I try to place any bet...
>
> [Blocked] ❌ 'Self-excluded for 29 more days'
>
> [Switch to 'Casino B'] And on the other platform?
>
> [Also blocked] ❌ Same thing. Self-exclusion works across **all platforms**."

---

### Technical Highlights (30 seconds)

**[Visual: Code snippets and architecture]**

**Voiceover:**

> "Let me quickly show the technical implementation.
>
> [Show smart contract] Here's the Concordium smart contract in Rust. It handles user registration, limit validation, and self-exclusion — all on-chain.
>
> [Show API endpoint] Gambling platforms integrate using simple REST APIs. Just two calls: check before bet, record after bet.
>
> [Show identity commitment code] Identity commitments are generated using Blake2b hashing — completely anonymous, but unique and verifiable.
>
> [Show euroe integration] We use Concordium's euroe stablecoin for payments — protocol-level EUR-backed stablecoin for consistent, compliant transactions."

---

### Impact & Innovation (20 seconds)

**[Visual: Impact statistics slide]**

**Voiceover:**

> "Why does PredictX matter?
>
> **For Users**: True protection that actually works, across all platforms they use.
>
> **For Operators**: Easy 2-hour integration, meets compliance requirements, competitive advantage.
>
> **For Regulators**: Transparent, auditable, privacy-preserving — all gambling activity tracked without compromising user privacy.
>
> **For Society**: Real addiction prevention, not just lip service."

---

### Closing (20 seconds)

**[Visual: Thank you slide with links]**

**Voiceover:**

> "PredictX is the only responsible gambling solution that truly works across platforms, thanks to Concordium's blockchain-native identity layer.
>
> I'm excited to submit this for the Encode Hackathon and would love to bring this to production to help make online gambling safer for everyone.
>
> Thank you for watching! Check out our GitHub for the full code, documentation, and integration guide.
>
> [Links appear]
> - GitHub: github.com/trenchsheikh/PredictX-Encode-Hackathon
> - Live Demo: [your-vercel-url]
> - Documentation: See README
>
> Thank you!"

---

## 📋 Pre-Recording Checklist

### Preparation

- [ ] Write and practice voiceover script
- [ ] Prepare demo accounts with test data
- [ ] Set up two browser windows for "different platforms" demo
- [ ] Test all demo flows multiple times
- [ ] Prepare slides for problem/solution/impact sections

### Technical Setup

- [ ] Clear browser cache/cookies for clean demo
- [ ] Disable browser notifications
- [ ] Close unnecessary tabs and applications
- [ ] Set browser zoom to 100%
- [ ] Use incognito/private mode
- [ ] Test microphone audio quality
- [ ] Ensure stable internet connection

### Recording Software

- [ ] Install screen recording software (OBS, Camtasia, Loom)
- [ ] Set recording resolution (1080p recommended)
- [ ] Test audio levels (voiceover should be clear)
- [ ] Enable cursor highlighting for visibility
- [ ] Set up hotkeys for start/stop recording

### Demo Data

- [ ] Create Test User 1 (for normal flow)
- [ ] Create Test User 2 (for limit exceeded)
- [ ] Set up prediction markets with reasonable odds
- [ ] Prepare "Casino B" tab for cross-platform demo
- [ ] Test self-exclusion flow beforehand

### Slides to Prepare

1. **Title Slide**: PredictX logo + tagline
2. **Problem Slide**: Animation showing platform hopping
3. **Solution Slide**: Architecture diagram
4. **Impact Slide**: Statistics and benefits
5. **Thank You Slide**: Links to GitHub, demo, docs

---

## 🎥 Recording Tips

### Voiceover Quality

- **Speak clearly and at moderate pace** (not too fast)
- **Show enthusiasm** but stay professional
- **Pause between sections** (easier to edit)
- **Re-record any mistakes** immediately
- **Smile while speaking** (sounds better even on audio)

### Visual Quality

- **Keep cursor movements slow and deliberate**
- **Zoom in on important UI elements** if needed
- **Highlight key information** (cursor, arrows, circles)
- **Use smooth transitions** between sections
- **Don't rush through screens** — give viewers time to read

### Common Mistakes to Avoid

- ❌ Speaking too fast
- ❌ Background noise (turn off notifications)
- ❌ Shaky cursor movements
- ❌ Text too small to read
- ❌ Skipping important details
- ❌ Going over 5 minutes (judges may stop watching)

### Editing Checklist

- [ ] Remove long pauses and "um"s
- [ ] Add background music (low volume)
- [ ] Add text overlays for key points
- [ ] Add transitions between sections
- [ ] Check audio levels are consistent
- [ ] Ensure video is under 5 minutes
- [ ] Export in HD (1080p)
- [ ] Test playback before submitting

---

## 🚀 B-Roll Ideas (Optional)

If you have extra time, add visual interest:

1. **Code snippets** scrolling through smart contract
2. **Network requests** in browser dev tools showing API calls
3. **Architecture diagram** animated
4. **Statistics** about gambling addiction
5. **User testimonials** (mockups)

---

## 📤 Upload & Submission

### Video Platforms

Choose one:
- **YouTube** (unlisted) - Recommended
- **Vimeo**
- **Loom**
- **Google Drive** (with public link)

### Video Settings

- **Title**: "PredictX - Cross-Platform Responsible Gambling Registry | Encode Hackathon 2025"
- **Description**: Include GitHub link, tech stack, and hackathon track
- **Tags**: concordium, responsible-gambling, blockchain, web3-id, encode-hackathon
- **Thumbnail**: Use PredictX logo or key demo screenshot

### Submission

Include in your hackathon submission:
- ✅ Video URL (YouTube/Vimeo)
- ✅ GitHub repository link
- ✅ Live demo URL (Vercel)
- ✅ Brief description (100 words)
- ✅ Team members

---

## 💡 Alternate Demo Ideas

If you want to vary the demo:

### Option A: Multi-User Demo

- Show User A setting limits and hitting them
- Switch to User B with different limits
- Show how each user is tracked independently
- Demonstrate aggregate statistics (anonymous)

### Option B: Operator Perspective

- Show gambling platform dashboard
- Walk through integration code (2 API calls)
- Show RG check logs and metrics
- Highlight ease of integration

### Option C: Regulator Perspective

- Show audit logs (anonymous)
- Display aggregate statistics
- Explain privacy preservation
- Show compliance reporting

---

## 🎯 Key Messages to Emphasize

1. **Cross-platform** — This is the #1 unique selling point
2. **Privacy-preserving** — Anonymous commitments, ZK proofs
3. **Easy integration** — Just 2 API calls for operators
4. **Blockchain-enforced** — Can't be bypassed or gamed
5. **euroe stablecoin** — Protocol-level payments
6. **Production-ready** — Real code, not just a prototype

---

## ⏱️ Time Budget

- Opening: 0:00 - 0:30 (30s)
- Problem: 0:30 - 1:15 (45s)
- Solution Overview: 1:15 - 1:45 (30s)
- Demo - Registration: 1:45 - 2:45 (60s)
- Demo - Normal Bet: 2:45 - 3:15 (30s)
- Demo - Limit Exceeded: 3:15 - 3:45 (30s)
- Demo - Cross-Platform: 3:45 - 4:45 (60s) ⭐ **LONGEST SECTION**
- Demo - Self-Exclusion: 4:45 - 5:15 (30s)
- Technical: 5:15 - 5:45 (30s)
- Impact: 5:45 - 6:05 (20s)
- Closing: 6:05 - 6:25 (20s)

**Total: ~6:25 minutes** (edit down to 5:00 if needed)

---

## 🎬 Ready to Film?

1. Practice the script 2-3 times
2. Do a full test recording
3. Review and identify issues
4. Record final version
5. Edit for clarity and pacing
6. Upload and submit!

**Good luck! You've got this! 🚀**

