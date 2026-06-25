import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

// Claude Code / Codex 各自的章节分组（与原站点一致）：编号区间 → 章节标题。
const CC_CHAPTERS = [
  { text: '一 · 基础入门', from: 1, to: 5 },
  { text: '二 · 上手与项目', from: 6, to: 13 },
  { text: '三 · 核心交互与操作', from: 14, to: 21 },
  { text: '四 · 高级功能扩展', from: 22, to: 30 },
  { text: '五 · 系统配置与优化', from: 31, to: 37 },
  { text: '六 · 高级参考与实战', from: 38, to: 48 },
  { text: '七 · 收尾与查阅', from: 49, to: 53 },
]
const CODEX_CHAPTERS = [
  { text: '一 · 基础入门', from: 1, to: 5 },
  { text: '二 · 各入口怎么上手', from: 6, to: 11 },
  { text: '三 · 核心交互与操作', from: 12, to: 17 },
  { text: '四 · 高级功能扩展', from: 18, to: 24 },
  { text: '五 · 工程化与自动化', from: 25, to: 29 },
  { text: '六 · 实战与进阶', from: 30, to: 34 },
  { text: '七 · 收尾与查阅', from: 35, to: 39 },
]

// 读取目录下 NN-*.md（首行 H1 作标题），按章节区间分组生成侧边栏。
// 标题仍自动取自 H1；新增文章只要落进对应编号区间就会自动出现。
function chapterSidebar(
  dir: string,
  chapters: { text: string; from: number; to: number }[]
) {
  const abs = path.resolve(process.cwd(), dir)
  const byNum: Record<number, { text: string; link: string }> = {}
  for (const f of fs.readdirSync(abs)) {
    const m = f.match(/^(\d+).*\.md$/)
    if (!m) continue
    const first = fs.readFileSync(path.join(abs, f), 'utf-8').split('\n')[0]
    byNum[parseInt(m[1], 10)] = {
      text: first.replace(/^#\s*/, '').trim(),
      link: `/${dir}/${f.replace(/\.md$/, '')}`,
    }
  }
  return chapters.map((ch) => {
    const items = []
    for (let n = ch.from; n <= ch.to; n++) if (byNum[n]) items.push(byNum[n])
    return { text: ch.text, collapsed: true, items }
  })
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI 编程指南',
  description: 'Claude Code + Codex 中文小白教程 · 92 篇',
  cleanUrls: true, // 生成 /claude-code/01-xxx（无 .html），与现有 README 链接一致
  srcExclude: ['**/README.md', 'README.en.md'], // README 不作为页面渲染

  appearance: 'dark', // 默认暗色，右上角保留亮 / 暗切换

  // 代码块高亮：亮色 github-light、暗色 github-dark，贴合终端观感
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  // 阅读时长 + 面包屑：构建期算好写进 frontmatter，组件直接读，SSR 无闪烁。
  // 仅处理 claude-code/ 与 codex/ 下编号文章；首页 / README / 404 自动跳过。
  transformPageData(pageData, { siteConfig }) {
    const rel = pageData.relativePath
    if (!/^(claude-code|codex)\/\d/.test(rel)) return
    pageData.frontmatter.crumb = rel.replace(/\.md$/, '')
    try {
      const body = fs
        .readFileSync(path.join(siteConfig.srcDir, rel), 'utf-8')
        .replace(/^---[\s\S]*?\n---/, '') // 去 frontmatter
        .replace(/```[\s\S]*?```/g, '') // 去围栏代码块
        .replace(/`[^`]*`/g, '') // 去行内代码
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 去图片
        .replace(/<[^>]+>/g, '') // 去 HTML 标签
      const cjk = (body.match(/[一-鿿]/g) || []).length
      const en = (body.match(/[A-Za-z0-9]+/g) || []).length
      // 中英混排：每分钟约 400 个「字/词」，向上取整、至少 1 分钟
      pageData.frontmatter.readingTime = Math.max(1, Math.round((cjk + en) / 400))
    } catch {}
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#a6e3a1' }],
    // 社交分享卡片：og:image 必须是绝对 URL，否则微信/Twitter/Facebook 抓不到
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AI 编程指南' }],
    ['meta', { property: 'og:description', content: 'Claude Code + Codex 中文小白教程 · 92 篇' }],
    ['meta', { property: 'og:url', content: 'https://coding.easya.work/' }],
    ['meta', { property: 'og:image', content: 'https://coding.easya.work/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://coding.easya.work/og.png' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Claude Code', link: '/claude-code/01-what-is-claude-code' },
      { text: 'Codex', link: '/codex/01-what-is-codex' },
      { text: 'GitHub', link: 'https://github.com/myluke/ai-coding-guide' },
    ],

    sidebar: {
      '/claude-code/': chapterSidebar('claude-code', CC_CHAPTERS),
      '/codex/': chapterSidebar('codex', CODEX_CHAPTERS),
    },

    search: { provider: 'local' },

    outline: { level: [2, 3], label: '本页目录' },

    docFooter: { prev: '上一篇', next: '下一篇' },

    editLink: {
      pattern: 'https://github.com/myluke/ai-coding-guide/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: { text: '最后更新于' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/myluke/ai-coding-guide' },
    ],
  },
})
