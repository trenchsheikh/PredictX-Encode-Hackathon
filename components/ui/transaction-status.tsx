"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, ExternalLink, Copy, AlertTriangle } from 'lucide-react';
import { getBSCScanTxUrl, formatTxHash } from '@/lib/blockchain-utils';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

interface TransactionStatusProps {
  status: TransactionStatus;
  txHash?: string;
  error?: string;
  title?: string;
  description?: string;
  onClose?: () => void;
  showDialog?: boolean;
}

export function TransactionStatus({
  status,
  txHash,
  error,
  title,
  description,
  onClose,
  showDialog = false,
}: TransactionStatusProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Auto-close success dialog after countdown
  useEffect(() => {
    if (status === 'success' && showDialog && onClose) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, showDialog, onClose]);

  const copyToClipboard = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
          title: title || 'Transaction Pending',
          description: description || 'Waiting for blockchain confirmation...',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
          title: title || 'Transaction Successful!',
          description: description || 'Your transaction has been confirmed on the blockchain.',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
        };
      case 'error':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          title: title || 'Transaction Failed',
          description: error || description || 'An error occurred while processing your transaction.',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config || status === 'idle') return null;

  // Inline version (not in dialog)
  if (!showDialog) {
    return (
      <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{config.icon}</div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold">{config.title}</h3>
            <p className="text-sm text-muted-foreground">{config.description}</p>
            
            {txHash && (
              <div className="flex items-center gap-2 pt-2">
                <code className="text-xs bg-secondary px-2 py-1 rounded flex-1">
                  {formatTxHash(txHash)}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href={getBSCScanTxUrl(txHash)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            )}

            {status === 'error' && error && (
              <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded text-xs">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-destructive">{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dialog version
  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            {config.icon}
            <div>
              <DialogTitle className="text-xl mb-2">{config.title}</DialogTitle>
              <DialogDescription className="text-sm">
                {config.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {txHash && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Hash</label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-secondary px-3 py-2 rounded flex-1 break-all">
                  {txHash}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  title="Copy transaction hash"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <a href={getBSCScanTxUrl(txHash)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on BSCScan
                </a>
              </Button>
            </div>
          )}

          {status === 'error' && error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm text-destructive">
                <p className="font-semibold mb-1">Error Details:</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-muted-foreground">
              <p>⏳ This may take a few moments. Please don't close this window.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center text-sm text-muted-foreground">
              Closing in {countdown} seconds...
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {status !== 'pending' && onClose && (
            <Button type="button" onClick={onClose}>
              {status === 'success' ? 'Done' : 'Close'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact version for inline use
export function TransactionStatusBadge({ status, txHash }: { status: TransactionStatus; txHash?: string }) {
  if (status === 'idle') return null;

  const getConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          text: 'Pending',
          className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-3 h-3" />,
          text: 'Confirmed',
          className: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
      case 'error':
        return {
          icon: <XCircle className="w-3 h-3" />,
          text: 'Failed',
          className: 'bg-red-500/10 text-red-500 border-red-500/20',
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
      {txHash && status === 'success' && (
        <a
          href={getBSCScanTxUrl(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 hover:opacity-70"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

