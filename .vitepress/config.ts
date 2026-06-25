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

// ===================== SEO 基础设施 =====================
const SITE = 'https://coding.easya.work'
const SITE_NAME = 'AI 编程指南'
const REPO = 'https://github.com/myluke/ai-coding-guide'
const OG_IMAGE = `${SITE}/og.png`

// 站点 Organization（JSON-LD 复用）
const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: SITE_NAME,
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` },
  sameAs: [REPO],
}

// 两个系列：名称 + 真实存在的入口页（用于 BreadcrumbList 的系列层）
const SERIES: Record<string, { name: string; entry: string }> = {
  'claude-code': { name: 'Claude Code', entry: '/claude-code/01-what-is-claude-code' },
  codex: { name: 'Codex', entry: '/codex/01-what-is-codex' },
}

// 关键页手写描述（≤150 全角字，含主关键词）；其余页从正文自动生成。
const DESC_OVERRIDE: Record<string, string> = {
  'index.md':
    '面向小白的 AI 编程中文教程。Claude Code 与 Codex 两大系列共 92 篇，从安装上手到 MCP、子代理、Skill、Hooks 实战，手把手把命令行 AI 变成你最快的那只手。',
  'claude-code/01-what-is-claude-code.md':
    'Claude Code 是什么？用大白话讲清它和 ChatGPT / Copilot / Cursor 的区别，给你一张能做 / 不能做清单和选用判断，是「Claude Code 小白教程」53 篇的开篇第一课。',
  'codex/01-what-is-codex.md':
    '认识 OpenAI Codex 与它的四种入口（桌面 App / CLI / IDE 扩展 / 云端 Web）：一篇讲清 Codex 是什么、四副面孔各管什么、和 ChatGPT 及 Claude Code 的区别，Codex 教程 39 篇开篇。',
}

// cleanUrls 下的规范 URL：去 .md、index 收敛到目录
function pageUrl(rel: string) {
  return `${SITE}/${rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
}

// 去掉「NN · 」编号前缀，供 <title> / og:title / schema headline 用（不影响可见 H1）
function cleanTitle(t?: string) {
  return (t || '').replace(/^\d+\s*[·.、]\s*/, '').trim()
}

// 正文 → 纯文本：剥离 frontmatter、代码、图片、引用块、标题、列表、强调标记等噪声
function bodyToText(raw: string) {
  const s = raw
    .replace(/^---[\s\S]*?\n---/, '') // frontmatter
    .replace(/```[\s\S]*?```/g, '') // 围栏代码块
    .replace(/`[^`]*`/g, '') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接 → 保留文字
    .replace(/<[^>]+>/g, '') // HTML 标签
  const out: string[] = []
  for (const line of s.split('\n')) {
    const l = line.trim()
    if (!l) continue
    if (l.startsWith('#')) continue // 标题
    if (l.startsWith('>')) continue // 引用块（系列导航）
    if (/^[-*+]\s/.test(l)) continue // 列表项（含「看完清单」）
    if (/^[-*_]{3,}$/.test(l)) continue // 分隔线
    if (/看完这一篇/.test(l)) continue // 清单引导句
    if (/^\*[^*]+\*$/.test(l)) continue // 独立斜体副标题
    out.push(l.replace(/[*_~]{1,3}/g, '')) // 去强调标记
    if (out.join(' ').length > 200) break
  }
  return out.join(' ').replace(/\s+/g, ' ').trim()
}

// 截取为 meta description：≤140 字，尽量在句末断开；过短则补系列尾句
function makeDescription(text: string, seriesName?: string) {
  let t = text
  const MAX = 140
  if (t.length > MAX) {
    const slice = t.slice(0, MAX)
    const end = Math.max(
      slice.lastIndexOf('。'),
      slice.lastIndexOf('！'),
      slice.lastIndexOf('？')
    )
    t = end > 60 ? slice.slice(0, end + 1) : slice.slice(0, MAX) + '…'
  }
  if (t.length < 40 && seriesName) {
    t = `${t}${t ? ' ' : ''}${seriesName} 教程，从入门到熟练。`.trim()
  }
  return t
}

export default defineConfig({
  lang: 'zh-CN',
  title: SITE_NAME,
  description: 'Claude Code + Codex 中文小白教程 · 92 篇',
  cleanUrls: true, // 生成 /claude-code/01-xxx（无 .html），与现有 README 链接一致
  srcExclude: ['**/README.md', 'README.en.md'], // README 不作为页面渲染

  appearance: 'dark', // 默认暗色，右上角保留亮 / 暗切换

  sitemap: { hostname: SITE }, // 构建期自动生成 /sitemap.xml
  lastUpdated: true, // 启用 git 时间戳 → pageData.lastUpdated（schema dateModified / sitemap lastmod）

  // 代码块高亮：亮色 github-light、暗色 github-dark，贴合终端观感
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  // 每页 SEO（构建/dev/客户端导航均生效）：
  // 阅读时长、面包屑、唯一 description、规范标题、canonical / og、JSON-LD。
  transformPageData(pageData, { siteConfig }) {
    const rel = pageData.relativePath
    if (rel === '404.md') return

    const isHome = rel === 'index.md'
    const isArticle = /^(claude-code|codex)\/\d/.test(rel)
    const url = pageUrl(rel)
    const clean = cleanTitle(pageData.title)
    const seriesKey = rel.split('/')[0]
    const series = SERIES[seriesKey]

    // 正文统计（仅文章）：阅读时长 + 词数，并为自动描述备用
    let bodyText = ''
    let wordCount = 0
    if (isArticle) {
      pageData.frontmatter.crumb = rel.replace(/\.md$/, '')
      try {
        const raw = fs.readFileSync(path.join(siteConfig.srcDir, rel), 'utf-8')
        const counted = raw
          .replace(/^---[\s\S]*?\n---/, '')
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`[^`]*`/g, '')
          .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
          .replace(/<[^>]+>/g, '')
        const cjk = (counted.match(/[一-鿿]/g) || []).length
        const en = (counted.match(/[A-Za-z0-9]+/g) || []).length
        wordCount = cjk + en
        pageData.frontmatter.readingTime = Math.max(1, Math.round(wordCount / 400))
        bodyText = bodyToText(raw)
      } catch {}
    }

    // —— 唯一 description（frontmatter 优先 → 手写覆盖 → 正文自动生成）——
    const desc =
      pageData.frontmatter.description ||
      DESC_OVERRIDE[rel] ||
      (bodyText
        ? makeDescription(bodyText, series?.name)
        : pageData.description)
    if (desc) pageData.description = desc

    // —— <title>：去编号前缀；首页交给模板拼接出「… | AI 编程指南」——
    if (isHome) {
      pageData.title = 'Claude Code 与 Codex 中文教程'
    } else if (clean) {
      pageData.title = clean
    }

    // —— per-page head：canonical + og ——
    const ogTitle = isHome
      ? `${SITE_NAME} · Claude Code 与 Codex 中文教程`
      : `${clean} | ${SITE_NAME}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:type', content: isArticle ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: ogTitle }]
    )
    if (desc)
      pageData.frontmatter.head.push([
        'meta',
        { property: 'og:description', content: desc },
      ])

    // —— JSON-LD ——
    if (isHome) {
      const graph = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE}/#website`,
            url: `${SITE}/`,
            name: SITE_NAME,
            description: desc,
            inLanguage: 'zh-CN',
            publisher: { '@id': ORG['@id'] },
          },
          ORG,
        ],
      }
      pageData.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(graph),
      ])
    } else if (isArticle && series) {
      const article: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: clean,
        description: desc,
        inLanguage: 'zh-CN',
        image: OG_IMAGE,
        mainEntityOfPage: url,
        author: { '@id': ORG['@id'] },
        publisher: { '@id': ORG['@id'] },
      }
      if (wordCount) article.wordCount = wordCount
      if (pageData.lastUpdated)
        article.dateModified = new Date(pageData.lastUpdated).toISOString()

      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: series.name,
            item: `${SITE}${series.entry}`,
          },
          { '@type': 'ListItem', position: 3, name: clean, item: url },
        ],
      }
      pageData.frontmatter.head.push(
        ['script', { type: 'application/ld+json' }, JSON.stringify(article)],
        ['script', { type: 'application/ld+json' }, JSON.stringify(breadcrumb)]
      )
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#a6e3a1' }],
    // 全站固定的社交标签（逐页会变的 og:title/description/url/type 在 transformPageData 注入）
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
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
