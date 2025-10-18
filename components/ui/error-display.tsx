'use client';

import { AlertCircle, RefreshCw, Wallet, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getUserFriendlyError,
  isRecoverableError,
  isUserCancellation,
} from '@/lib/user-friendly-errors';

interface ErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className,
}: ErrorDisplayProps) {
  if (!error) return null;

  const friendly = getUserFriendlyError(error);
  const recoverable = isRecoverableError(error);
  const userCancelled = isUserCancellation(error);

  // Don't show anything for user cancellations (they already know)
  if (userCancelled && !onDismiss) return null;

  return (
    <Card
      className={`border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 ${className || ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            {userCancelled ? (
              <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                {friendly.title}
              </h3>
              <p className="mt-1 text-sm text-red-800 dark:text-red-200">
                {friendly.message}
              </p>
              {friendly.suggestion && (
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                  💡 {friendly.suggestion}
                </p>
              )}
            </div>

            {(onRetry || onDismiss) && (
              <div className="flex gap-2 pt-2">
                {onRetry && recoverable && (
                  <Button
                    size="sm"
                    onClick={onRetry}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {friendly.action || 'Try Again'}
                  </Button>
                )}
                {onDismiss && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onDismiss}
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Inline error message (simpler version)
 */
export function InlineError({
  error,
  className,
}: {
  error: any;
  className?: string;
}) {
  if (!error) return null;

  const friendly = getUserFriendlyError(error);
  const userCancelled = isUserCancellation(error);

  // Don't show anything for user cancellations
  if (userCancelled) return null;

  return (
    <div
      className={`flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm dark:bg-red-950 ${className || ''}`}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
      <div className="flex-1">
        <span className="font-medium text-red-900 dark:text-red-100">
          {friendly.title}:
        </span>{' '}
        <span className="text-red-800 dark:text-red-200">
          {friendly.message}
        </span>
        {friendly.suggestion && (
          <div className="mt-1 text-red-700 dark:text-red-300">
            {friendly.suggestion}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Toast-style error notification
 */
export function ErrorToast({
  error,
  onClose,
}: {
  error: any;
  onClose?: () => void;
}) {
  if (!error) return null;

  const friendly = getUserFriendlyError(error);
  const userCancelled = isUserCancellation(error);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="border-red-200 bg-white shadow-lg dark:border-red-800 dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {userCancelled ? (
                <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {friendly.title}
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {friendly.message}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
