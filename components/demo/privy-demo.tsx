'use client';

import { useState } from 'react';
import {
  usePrivy,
  useLoginWithEmail,
  useSendTransaction,
} from '@/lib/mock-privy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Demo component following the Privy documentation examples
export function PrivyDemo() {
  const { authenticated, user, login, logout } = usePrivy();
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { sendTransaction } = useSendTransaction();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Privy Authentication Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Connection */}
          <div className="space-y-2">
            <h3 className="font-semibold">1. Wallet Connection</h3>
            {!authenticated ? (
              <Button onClick={login}>Connect Wallet</Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-green-600">
                  ✅ Connected as:{' '}
                  {user?.wallet?.address || user?.email?.address}
                </p>
                <Button variant="outline" onClick={logout}>
                  Disconnect
                </Button>
              </div>
            )}
          </div>

          {/* Email Login */}
          <div className="space-y-2">
            <h3 className="font-semibold">
              2. Email Login (Following Documentation)
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button onClick={() => sendCode(email)}>Send Code</Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter OTP (use 123456)"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
              <Button onClick={() => loginWithCode(code)}>Login</Button>
            </div>
          </div>

          {/* Transaction Demo */}
          {authenticated && (
            <div className="space-y-2">
              <h3 className="font-semibold">3. Send Transaction</h3>
              <Button
                onClick={() =>
                  sendTransaction({
                    to: '0xE3070d3e4309afA3bC9a6b057685743CF42da77C',
                    value: 100000,
                  })
                }
              >
                Send Mock Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
