'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const trackWebVital = (metric: any) => {
      console.log('Web Vital:', metric);
    };

    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          trackWebVital({
            name: 'LCP',
            value: entry.startTime,
            rating:
              entry.startTime < 2500
                ? 'good'
                : entry.startTime < 4000
                  ? 'needs-improvement'
                  : 'poor',
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    const trackFID = (event: Event) => {
      const fid = event.timeStamp;
      trackWebVital({
        name: 'FID',
        value: fid,
        rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor',
      });
    };

    let clsValue = 0;
    const clsObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }

      trackWebVital({
        name: 'CLS',
        value: clsValue,
        rating:
          clsValue < 0.1
            ? 'good'
            : clsValue < 0.25
              ? 'needs-improvement'
              : 'poor',
      });
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS Observer not supported');
    }

    ['click', 'keydown', 'mousedown', 'pointerdown', 'touchstart'].forEach(
      type => {
        document.addEventListener(type, trackFID, {
          once: true,
          passive: true,
        });
      }
    );

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return null;
}
