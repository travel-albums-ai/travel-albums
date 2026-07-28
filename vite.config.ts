import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode, command }) => {

  const plugins = [react(), cssInjectedByJsPlugin()];

  if (process.env.VITE_BUNDLE_VISUALIZE === 'true' && command === 'build') {
    plugins.push(
      visualizer({
        filename: 'dist/stats.json',
        template: 'raw-data',
        open: false,
        gzipSize: false,
        title: 'Bundle Visualizer',
        brotliSize: false,
      }) as any
    )
  }

  return {
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins,
    server: {
      watch: {
        ignored: ['**/thumbnails/**', '**/Takeout/**', '**/sprites/**'],
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id) return;
            if (!id.includes('node_modules')) return;

            if (id.includes('lucide-react')) return 'vendor-ux-lucide';
            if (id.includes('blurhash')) return 'vendor-ux-blurhash';
            if (id.includes('uplot')) return 'vendor-ux-uplot';
            if (id.includes('react-type-animation')) return 'vendor-ux-type-animation';
            if (id.includes('react-virtuoso')) return 'vendor-render-virtuoso';
            if (id.includes('react-zoom-pan-pinch')) return 'vendor-ux-zoom-pan-pinch';
            if (id.includes('react-intersection-observer')) return 'vendor-render-intersection-observer';
            if (id.includes('react-resizable-panels')) return 'vendor-ux-resizable-panels';
            if (id.includes('leaflet')) return 'vendor-map-leaflet';
            if (id.includes('localforage')) return 'vendor-storage-localforage';
            if (id.includes('@tanstack')) return 'vendor-render-tanstack';
            if (id.includes('exifr')) return 'vendor-parse-exifr';
            if (id.includes('@mui/x-charts') || id.includes('@mui/x-data-grid') || id.includes('recharts') || id.includes('apexcharts')) return 'vendor-ux-mui-charts';
            if (id.includes('react-router') || id.includes('react-router-dom')) return 'vendor-render-router';
            if (id.includes('@mui') || id.includes('material-ui') || id.includes('@emotion')) return 'vendor-ux-mui';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-render-react';

            return 'vendor';
          },
          // chunkFileNames: (chunkInfo) => composeChunkFileNames(chunkInfo)
        },
      }
    },
  }
})
