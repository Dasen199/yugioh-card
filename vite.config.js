import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import copy from 'rollup-plugin-copy';
import jsonfile from 'jsonfile';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// 检查是否使用CDN
const useCDN = process.env.USE_CDN === 'true';

function editPackageJson() {
  return {
    name: 'edit-package-json',
    closeBundle() {
      const file = 'dist/package.json';
      jsonfile.readFile(file, (err, obj) => {
        if (!err) {
          obj.main = 'umd/index.js';
          obj.module = 'es/index.mjs';
          jsonfile.writeFile(file, obj, { spaces: 2, EOL: '\r\n' });
        }
      });
    },
  };
}

// 外部依赖设置 - 当使用CDN时生效
const externalDeps = useCDN ? ['vue', 'element-plus', '@element-plus/icons-vue'] : [];

const buildLib = {
  lib: {
    entry: path.resolve(__dirname, 'packages/yugioh-card'),
    name: 'YugiohCard',
    fileName: format => {
      if (format === 'es') {
        return `${format}/index.mjs`;
      }
      return `${format}/index.js`;
    },
  },
  rollupOptions: {
    plugins: [
      copy({
        targets: [
          { src: 'LICENSE', dest: 'dist' },
          { src: 'README.md', dest: 'dist' },
          { src: 'packages/yugioh-card/package.json', dest: 'dist' },
        ],
        hook: 'writeBundle',
      }),
      editPackageJson(),
    ],
  },
};

const buildWebsite = {
  outDir: 'docs',
  // 优化打包策略
  rollupOptions: {
    external: externalDeps,
    output: {
      // 代码分割策略
      manualChunks: (id) => {
        if (id.includes('element-plus')) {
          return 'element-plus';
        }
        if (id.includes('yugioh-card')) {
          return 'yugioh-card';
        }
        if (id.includes('node_modules')) {
          return 'vendor';
        }
        return null;
      },
      // 设置chunk大小警告上限，避免干扰构建
      chunkSizeWarningLimit: 1000,
      // CDN依赖全局变量
      globals: useCDN ? {
        'vue': 'Vue',
        'element-plus': 'ElementPlus',
        '@element-plus/icons-vue': 'ElementPlusIconsVue'
      } : {}
    }
  },
  // 启用压缩优化
  minify: 'terser',
  terserOptions: {
    compress: {
      // 移除console.log
      drop_console: true,
      // 移除debugger
      drop_debugger: true
    }
  },
  // 启用gzip压缩
  brotliSize: false,
  // 禁用源码映射提高构建速度
  sourcemap: false,
};

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // 构建分析插件 - 生成stats.html查看打包情况
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  build: process.argv.includes('lib') ? buildLib : buildWebsite,
  define: {
    // 环境变量
    'process.env.USE_CDN': JSON.stringify(useCDN),
  }
});
