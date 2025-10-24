'use client';

import { useEffect, type CSSProperties } from 'react';

import { cn } from '@/lib/utils';

const SPLINE_VIEWER_SRC =
  'https://unpkg.com/@splinetool/viewer@1.10.82/build/spline-viewer.js';

const SPLINE_SCENE_URL =
  'https://prod.spline.design/Tq74WiMN9nhxnxDO/scene.splinecode';

export function SplineBackground({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const scriptSelector = `script[src="${SPLINE_VIEWER_SRC}"]`;
    const existingScript = document.querySelector(scriptSelector);

    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = SPLINE_VIEWER_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden',
        className
      )}
      aria-hidden
      style={style}
    >
      <spline-viewer
        url={SPLINE_SCENE_URL}
        style={{ display: 'block', width: '100%', height: '100%' }}
        loading="lazy"
      />
    </div>
  );
}
