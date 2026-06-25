import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.css'

// 自定义布局：在 DefaultTheme 之上，给文章正文套一层「终端窗口」皮肤。
export default {
  extends: DefaultTheme,
  Layout,
}
