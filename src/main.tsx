import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx is loaded!')  // ← ロード確認

const root = document.getElementById('root')

if (root) {
  console.log('Root found, mounting React...')  // ← マウント成功ログ
  createRoot(root).render(<App />)
} else {
  console.error('Root element not found!')
  document.body.innerHTML = '<h1 style="color: red; text-align: center; padding: 100px; font-size: 3rem;">ERROR: <div id="root"></div> がありません！</h1>'
}