const CACHE_NAME = '1.1.0';
// sw.js - Service Worker 文件
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 强制激活新 Service Worker
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
    }).then(() => self.clients.claim())
  );
});

// 主应用逻辑
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          // 检测到新版本
          showUpdateNotification();
        }
      });
    });

    // 主动轮询检查更新（可选）
    setInterval(() => reg.update(), 60 * 60 * 1000); // 每小时检查
  });
}

// 显示更新提示
function showUpdateNotification() {
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div class="update-toast">
      新版本已发布！
      <button id="reload-btn">立即更新</button>
    </div>
  `;
  document.body.appendChild(toast);

  document.getElementById('reload-btn').addEventListener('click', () => {
    window.location.reload(true); // 强制刷新
  });
}