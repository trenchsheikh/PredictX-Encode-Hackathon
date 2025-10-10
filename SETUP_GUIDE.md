# BNBPredict Setup Guide

## 🚨 **Issue Identified**
Node.js is installed but not in the system PATH. This means npm commands don't work in new terminal sessions.

## 📋 **Prerequisites**

### 1. Node.js is Already Installed ✅
Node.js v22.19.0 is installed at: `C:\Program Files\nodejs\`
npm v10.9.3 is also available

### 2. Fix PATH Issue
The issue is that Node.js is not in your system PATH. Choose one solution:

#### **Option A: Add to System PATH (Permanent)**
1. Press `Windows + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "System Variables", select "Path" → "Edit"
4. Click "New" → Add: `C:\Program Files\nodejs`
5. Click "OK" on all dialogs
6. Restart terminal and test: `node --version`

#### **Option B: Use Provided Scripts (Quick Fix)**
- **Double-click**: `start-dev.bat` (easiest)
- **Right-click**: `fix-path.ps1` → "Run with PowerShell"

## 🚀 **Project Setup**

### Step 1: Install Dependencies
```bash
# Navigate to project directory
cd C:\bnbet

# Install all dependencies
npm install
```

### Step 2: Environment Setup
```bash
# Copy environment template
copy env.example .env.local

# Edit .env.local with your Privy App ID
# Add: NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

### Step 3: Run Development Server
```bash
npm run dev
```

The project will be available at: http://localhost:3000

## 🔧 **Alternative Package Managers**

If you prefer other package managers:

### Using Yarn
```bash
# Install Yarn globally
npm install -g yarn

# Install dependencies
yarn install

# Run development server
yarn dev
```

### Using pnpm
```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## 🐛 **Common Issues & Solutions**

### Issue 1: "npm is not recognized"
**Solution**: Install Node.js from https://nodejs.org/

### Issue 2: Permission Errors
**Solution**: Run terminal as Administrator

### Issue 3: Port Already in Use
**Solution**: 
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Issue 4: Missing Dependencies
**Solution**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📦 **Project Dependencies**

### Core Dependencies
- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

### Blockchain & Wallet
- **@privy-io/react-auth**: Wallet authentication
- **wagmi**: Ethereum library
- **viem**: TypeScript interface for Ethereum

### UI Components
- **Radix UI**: Accessible components
- **Lucide React**: Icons
- **Framer Motion**: Animations
- **Recharts**: Charts

### Forms & Validation
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## 🎨 **Features Implemented**

### Interactive Components
- ✅ 3D Card effects
- ✅ Particle background system
- ✅ Magnetic hover effects
- ✅ Animated beam connections
- ✅ Motion highlights
- ✅ Apple-style animations
- ✅ Shimmering text effects
- ✅ Interactive grid patterns

### BNB Theme
- ✅ BNB color scheme (#F0B90B)
- ✅ Custom animations
- ✅ Responsive design
- ✅ Modern UI/UX

## 🚀 **Next Steps**

1. **Install Node.js** from https://nodejs.org/
2. **Run setup commands** above
3. **Configure Privy** with your App ID
4. **Start development server**
5. **Test the application**

## 📞 **Support**

If you encounter any issues:
1. Check Node.js installation
2. Verify npm is working
3. Clear cache and reinstall dependencies
4. Check for port conflicts
5. Review error messages in terminal

---

**Happy coding! 🎉**
