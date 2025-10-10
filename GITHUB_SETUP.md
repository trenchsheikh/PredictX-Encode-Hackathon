# GitHub Setup Guide

## Prerequisites
1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Install with default settings
   - Restart your terminal after installation

2. **GitHub Account**: Make sure you have access to https://github.com/trenchsheikh/darkbet

## Steps to Push Code to GitHub

### 1. Initialize Git Repository
```bash
cd C:\bnbet
git init
```

### 2. Add All Files
```bash
git add .
```

### 3. Create Initial Commit
```bash
git commit -m "Initial commit: BNB-themed prediction market platform with Privy integration"
```

### 4. Add Remote Repository
```bash
git remote add origin https://github.com/trenchsheikh/darkbet.git
```

### 5. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Alternative: Using GitHub Desktop
1. Download GitHub Desktop from: https://desktop.github.com/
2. Clone the repository: https://github.com/trenchsheikh/darkbet
3. Copy all files from `C:\bnbet` to the cloned repository folder
4. Commit and push through GitHub Desktop

## Project Structure
```
bnbet/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── my-bets/           # My Bets page
│   ├── how-it-works/      # How it Works page
│   └── leaderboard/       # Leaderboard page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── prediction/        # Prediction-related components
│   ├── providers/         # Context providers
│   └── demo/              # Demo components
├── lib/                   # Utility functions
│   ├── mock-privy.ts      # Mock Privy implementation
│   ├── privy-config.ts    # Privy configuration
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
├── public/                # Static assets
├── scripts/               # Build scripts
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Features Implemented
- ✅ BNB-themed prediction market platform
- ✅ Responsive design with Tailwind CSS
- ✅ Interactive components from shadcn.io
- ✅ Mock Privy wallet integration
- ✅ Prediction market functionality
- ✅ User authentication flow
- ✅ Modern UI with animations
- ✅ TypeScript support
- ✅ Next.js 14 with App Router

## Running the Project
```bash
npm install
npm run dev
```

The application will be available at http://localhost:3000 (or next available port)

## Next Steps
1. Install Git and follow the steps above
2. Push the code to GitHub
3. Set up environment variables for production
4. Deploy to Vercel or similar platform
5. Configure real Privy integration when ready
