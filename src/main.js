import { createApp } from 'vue';
import App from './App.vue';
import 'normalize.css';
import '@/styles/main.scss';

const app = createApp(App);

// 检查是否从CDN加载了Element Plus
const isElementPlusCDNLoaded = window.ElementPlus !== undefined;

async function setupApp() {
  try {
    // 如果CDN加载失败，则从本地导入
    if (!isElementPlusCDNLoaded) {
      console.log('从本地加载Element Plus');
      const ElementPlusModule = await import('element-plus');
      const ElementPlus = ElementPlusModule.default;
      
      const ElementPlusLocaleModule = await import('element-plus/es/locale/lang/zh-cn');
      const zhCn = ElementPlusLocaleModule.default;
      
      await import('element-plus/dist/index.css');
      
      app.use(ElementPlus, {
        locale: zhCn,
      });
    } else {
      console.log('使用CDN版本的Element Plus');
    }
    
    // 添加全局错误处理
    app.config.errorHandler = (err, vm, info) => {
      console.error('全局错误:', err);
      console.info('错误组件:', vm);
      console.info('错误信息:', info);
    };
    
    // 挂载应用
    app.mount('#app');
    
    // 移除加载指示器
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  } catch (error) {
    console.error('应用初始化错误:', error);
    
    // 显示错误信息
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.innerHTML = `
        <div style="text-align: center;">
          <p style="color: #f56c6c; font-size: 16px;">加载失败</p>
          <p style="margin-top: 10px; color: #606266;">请刷新页面重试</p>
        </div>
      `;
    }
  }
}

// 启动应用
setupApp();
