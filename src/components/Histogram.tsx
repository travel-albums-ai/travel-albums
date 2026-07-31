import { Tooltip } from '@mui/material';
import { useEffect, useRef } from 'react';

interface HistogramProps {
  imageUrl: string;
  width?: number;
  height?: number;
}

export default function RGBHistogram({
  imageUrl,
  width = 200,
  height = 200,
}: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl;
      });

      if (cancelled) return;

      const off = document.createElement('canvas');
      off.width = img.naturalWidth;
      off.height = img.naturalHeight;

      const ctx = off.getContext('2d', {
        willReadFrequently: true,
      })!;

      ctx.drawImage(img, 0, 0);

      const { data } = ctx.getImageData(0, 0, off.width, off.height);

      const r = new Uint32Array(256);
      const g = new Uint32Array(256);
      const b = new Uint32Array(256);

      for (let i = 0; i < data.length; i += 4) {
        r[data[i]]++;
        g[data[i + 1]]++;
        b[data[i + 2]]++;
      }

      const max = Math.max(
        ...r,
        ...g,
        ...b
      );

      const canvas = canvasRef.current;
      if (!canvas) return;

      const out = canvas.getContext('2d')!;
      out.clearRect(0, 0, width, height);

      out.fillStyle = 'transparent';
      out.fillRect(0, 0, width, height);

      const barWidth = width / 256;

      const draw = (arr: Uint32Array, color: string) => {
        out.fillStyle = color;

        for (let i = 0; i < 256; i++) {
          const h = (arr[i] / max) * height;

          out.fillRect(
            i * barWidth,
            height - h,
            Math.max(1, barWidth + 0.5),
            h
          );
        }
      };

      draw(r, 'red');
      draw(g, 'lime');
      draw(b, 'deepskyblue');
    })();

    return () => {
      cancelled = true;
    };
  }, [imageUrl, width, height]);

  return (
    <Tooltip title="RGB Histogram" placement="left" arrow>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width,
          opacity: 0.75,
          filter: 'saturate(0.5)',
          height,
          display: 'block',
          borderRadius: 8,
        }}
      />
    </Tooltip>
  );
}
