// Comprehensive Mock Privy implementation that follows the exact API
// This allows us to test the UI without installing the actual Privy package

import { useState, useEffect } from 'react';

export interface PrivyUser {
  id: string;
  wallet?: {
    address: string;
    chainId: string;
  };
  email?: {
    address: string;
  };
  phone?: {
    number: string;
  };
  google?: {
    email: string;
  };
  twitter?: {
    username: string;
  };
  discord?: {
    username: string;
  };
}

export interface PrivyAuthState {
  ready: boolean;
  authenticated: boolean;
  user: PrivyUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  sendCode: (email: string) => Promise<void>;
  loginWithCode: (code: string) => Promise<void>;
  connectWallet: () => Promise<void>;
}

// Mock implementation following Privy's exact API
export function usePrivy(): PrivyAuthState {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<PrivyUser | null>(null);

  useEffect(() => {
    // Simulate Privy initialization
    const timer = setTimeout(() => {
      setReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = async () => {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 500));
    setAuthenticated(true);
    setUser({
      id: 'mock-user-123',
      wallet: {
        address: '0x1234567890123456789012345678901234567890',
        chainId: '0x38' // BSC mainnet
      }
    });
  };

  const connectWallet = async () => {
    return login();
  };

  const logout = async () => {
    setAuthenticated(false);
    setUser(null);
  };

  const loginWithEmail = async (email: string) => {
    // Simulate email login
    await new Promise(resolve => setTimeout(resolve, 500));
    setAuthenticated(true);
    setUser({
      id: 'mock-user-123',
      email: { address: email }
    });
  };

  const sendCode = async (email: string) => {
    // Simulate sending OTP
    console.log(`Sending OTP to ${email}`);
    alert(`OTP sent to ${email} (This is a mock implementation)`);
  };

  const loginWithCode = async (code: string) => {
    // Simulate code verification
    if (code === '123456') {
      setAuthenticated(true);
      setUser({
        id: 'mock-user-123',
        email: { address: 'user@example.com' }
      });
    } else {
      alert('Invalid code. Try 123456');
    }
  };

  return {
    ready,
    authenticated,
    user,
    login,
    logout,
    loginWithEmail,
    sendCode,
    loginWithCode,
    connectWallet
  };
}

// Mock PrivyProvider component
export function PrivyProvider({ children, appId, config }: { 
  children: React.ReactNode; 
  appId: string; 
  config: any; 
}) {
  return <>{children}</>;
}

// Mock useLoginWithEmail hook
export function useLoginWithEmail() {
  const { sendCode, loginWithCode } = usePrivy();
  return { sendCode, loginWithCode };
}

// Mock useSendTransaction hook
export function useSendTransaction() {
  const sendTransaction = async (tx: any) => {
    console.log('Mock transaction:', tx);
    alert(`Mock transaction sent: ${JSON.stringify(tx, null, 2)}`);
  };
  return { sendTransaction };
}

// Mock useWallets hook
export function useWallets() {
  const wallets = [
    {
      address: '0x1234567890123456789012345678901234567890',
      chainId: '0x38',
      connector: { name: 'MetaMask' }
    }
  ];
  return { wallets };
}

// Mock usePrivyWagmi hook
export function usePrivyWagmi() {
  return {
    walletClient: null,
    publicClient: null,
    chain: { id: 56, name: 'BNB Smart Chain' }
  };
}