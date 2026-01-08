import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initSentry } from './lib/sentry'
import { migrateStorage } from './utils/storageMigration'

// 初始化 Sentry（在应用启动前）
initSentry()

// 执行存储迁移（将未加密数据迁移到加密存储）
migrateStorage()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
