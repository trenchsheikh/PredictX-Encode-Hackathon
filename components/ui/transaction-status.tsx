'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  AlertTriangle,
} from 'lucide-react';
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
        setCountdown(prev => {
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
          icon: <Loader2 className="h-12 w-12 animate-spin text-blue-500" />,
          title: title || 'Transaction Pending',
          description: description || 'Waiting for blockchain confirmation...',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          title: title || 'Transaction Successful!',
          description:
            description ||
            'Your transaction has been confirmed on the blockchain.',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
        };
      case 'error':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: title || 'Transaction Failed',
          description:
            error ||
            description ||
            'An error occurred while processing your transaction.',
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
      <div
        className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{config.icon}</div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-white">{config.title}</h3>
            <p className="text-sm text-gray-300">{config.description}</p>

            {txHash && (
              <div className="flex items-center gap-2 pt-2">
                <code className="flex-1 rounded border border-gray-700/50 bg-black px-2 py-1 text-xs text-white">
                  {formatTxHash(txHash)}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="border-gray-600/50 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-gray-600/50 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                  asChild
                >
                  <a
                    href={getBSCScanTxUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}

            {status === 'error' && error && (
              <div className="flex items-start gap-2 rounded border border-red-500/20 bg-red-500/10 p-2 text-xs">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <span className="text-red-400">{error}</span>
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
      <DialogContent className="border-gray-700/50 bg-black backdrop-blur-md sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4 text-center">
            {config.icon}
            <div>
              <DialogTitle className="mb-2 text-xl text-white">
                {config.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-300">
                {config.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {txHash && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Transaction Hash
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded border border-gray-700/50 bg-black px-3 py-2 text-xs text-white">
                  {txHash}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  title="Copy transaction hash"
                  className="border-gray-600/50 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-600/50 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                asChild
              >
                <a
                  href={getBSCScanTxUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on BSCScan
                </a>
              </Button>
            </div>
          )}

          {status === 'error' && error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <div className="text-sm text-red-400">
                <p className="mb-1 font-semibold">Error Details:</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-gray-300">
              <p>
                ⏳ This may take a few moments. Please don't close this window.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center text-sm text-gray-400">
              Closing in {countdown} seconds...
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {status !== 'pending' && onClose && (
            <Button
              type="button"
              onClick={onClose}
              className={
                status === 'success'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'border-gray-600/50 bg-black text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            >
              {status === 'success' ? 'Done' : 'Close'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact version for inline use
export function TransactionStatusBadge({
  status,
  txHash,
}: {
  status: TransactionStatus;
  txHash?: string;
}) {
  if (status === 'idle') return null;

  const getConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: 'Pending',
          className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          text: 'Confirmed',
          className: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
      case 'error':
        return {
          icon: <XCircle className="h-3 w-3" />,
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
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
      {txHash && status === 'success' && (
        <a
          href={getBSCScanTxUrl(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 hover:opacity-70"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
