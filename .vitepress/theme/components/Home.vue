<script setup lang="ts">
// 自定义首页：左侧文案 + 右侧终端窗口演示 + 底部两张分栏卡片。
// 通过 Layout.vue 的 #home-hero-before 插槽注入，保留顶部导航栏。
</script>

<template>
  <div class="home">
    <!-- ===================== Hero ===================== -->
    <section class="hero">
      <div class="hero-info">
        <span class="badge">
          <i class="badge-dot" />
          Claude Code · Codex · 92 篇
        </span>

        <h1 class="headline">
          <span class="ln">在终端里，</span>
          <span class="ln grad">长出生产力</span>
        </h1>

        <p class="lede">
          面向小白的 AI 编程指南。从装好到熟练，把命令行变成你最快的那只手。
        </p>

        <div class="cta">
          <a class="btn btn-primary" href="/claude-code/01-what-is-claude-code">
            从 Claude Code 开始 →
          </a>
          <a class="btn btn-ghost" href="/codex/01-what-is-codex">Codex 篇</a>
        </div>
      </div>

      <!-- ===================== 终端窗口 mockup（始终暗色） ===================== -->
      <div class="term" aria-hidden="true">
        <div class="term-bar">
          <span class="dots"><i /><i /><i /></span>
          <span class="term-name">claude</span>
        </div>
        <div class="term-body">
          <div class="term-head">
            <svg class="glyph" viewBox="0 0 64 60" width="52" height="49">
              <rect x="12" y="12" width="40" height="30" rx="9" fill="#f4a8bc" />
              <rect x="22" y="22" width="5.5" height="11" rx="2.7" fill="#1a1620" />
              <rect x="36.5" y="22" width="5.5" height="11" rx="2.7" fill="#1a1620" />
              <rect x="16" y="42" width="4" height="9" rx="2" fill="#f4a8bc" />
              <rect x="25" y="42" width="4" height="9" rx="2" fill="#f4a8bc" />
              <rect x="35" y="42" width="4" height="9" rx="2" fill="#f4a8bc" />
              <rect x="44" y="42" width="4" height="9" rx="2" fill="#f4a8bc" />
            </svg>
            <div class="term-meta">
              <div><b>Claude Code</b> <span class="mut">v2.1.183</span></div>
              <div class="mut">Opus 4.8 (1M context)</div>
              <div class="mut">Claude Max</div>
            </div>
          </div>

          <ul class="log">
            <li>根因是 <code>orders.list</code> 的 N+1，我改成批量预加载 + 加复合索引。</li>
            <li>Update(src/orders.ts)</li>
          </ul>

          <pre class="code"><span class="cm">// 批量预加载，一次查回所有 user</span>
<span class="kw">const</span> ids = orders.<span class="fn">map</span>(o <span class="op">=&gt;</span> o.userId)
<span class="kw">const</span> users = <span class="kw">await</span> db.user.<span class="fn">findMany</span>({
  where: { id: { <span class="kw">in</span>: ids } },
})</pre>

          <ul class="log">
            <li>Bash(npm run bench)</li>
          </ul>
          <div class="metrics">
            <div>P95 <span class="g">320ms → 90ms</span></div>
            <div>QPS <span class="g">1.2k → 4.6k</span></div>
            <div>queries/req <span class="g">24 → 2</span></div>
          </div>

          <ul class="log">
            <li>定位到 <code>orders.list</code> 的 N+1：批量预加载 + 复合索引，P95 降 72%、每请求查询数 24→2。</li>
          </ul>

          <div class="prompt">❯<span class="caret" /></div>
        </div>
      </div>
    </section>

    <!-- ===================== 两张分栏卡片 ===================== -->
    <section class="decks">
      <a class="deck" href="/claude-code/01-what-is-claude-code">
        <div class="deck-top"><span class="deck-count">53 篇</span><span class="deck-arrow">→</span></div>
        <h3 class="deck-title">Claude Code 篇</h3>
        <p class="deck-desc">从安装、代理循环，到 MCP、子代理、Skill、Hooks 与综合实战。</p>
      </a>
      <a class="deck" href="/codex/01-what-is-codex">
        <div class="deck-top"><span class="deck-count">39 篇</span><span class="deck-arrow">→</span></div>
        <h3 class="deck-title">Codex 篇</h3>
        <p class="deck-desc">四种入口、AGENTS.md、沙箱审批、config.toml 到工程化自动化。</p>
      </a>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(28px, 5vw, 72px) 24px 96px;
}

/* ===================== Hero ===================== */
.hero {
  display: grid;
  grid-template-columns: 1fr 1.12fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}
.hero-info {
  min-width: 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 15px;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 10px 1px var(--vp-c-brand-1);
}

.headline {
  margin: 28px 0 0;
  font-weight: 800;
  font-size: clamp(40px, 6vw, 76px);
  line-height: 1.06;
  letter-spacing: -0.02em;
}
.headline .ln {
  display: block;
}
.headline .grad {
  background: linear-gradient(120deg, #b7f0ad 10%, #56d3a3 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lede {
  margin: 26px 0 0;
  max-width: 30em;
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 38px;
}
.btn {
  display: inline-flex;
  align-items: center;
  padding: 13px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.btn-primary {
  color: #08130c;
  background: linear-gradient(120deg, #a6e3a1, #6fd6c0);
  box-shadow: 0 8px 26px -10px rgba(111, 214, 192, 0.6);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px -10px rgba(111, 214, 192, 0.7);
}
.btn-ghost {
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}
.btn-ghost:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}

/* ===================== 终端窗口 mockup（恒暗色） ===================== */
.term {
  border: 1px solid #232a33;
  border-radius: 16px;
  overflow: hidden;
  background: #0b0f15;
  box-shadow: 0 40px 90px -40px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  font-family: var(--vp-font-family-mono);
}
.term-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #11161d;
  border-bottom: 1px solid #232a33;
}
.term-bar .dots {
  display: inline-flex;
  gap: 8px;
}
.term-bar .dots i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.term-bar .dots i:nth-child(1) {
  background: #ff5f56;
}
.term-bar .dots i:nth-child(2) {
  background: #ffbd2e;
}
.term-bar .dots i:nth-child(3) {
  background: #27c93f;
}
.term-name {
  color: #8b949e;
  font-size: 13px;
}

.term-body {
  padding: 22px 22px 18px;
  font-size: 13.5px;
  line-height: 1.62;
  color: #c9d1d9;
}
.term-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  margin-bottom: 14px;
  border-bottom: 1px solid #1b212a;
}
.term-meta b {
  color: #e6edf3;
}
.term-meta .mut {
  color: #6e7681;
}

.log {
  list-style: none;
  margin: 0;
  padding: 0;
}
.log li {
  position: relative;
  padding-left: 20px;
  margin: 7px 0;
}
.log li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 0.62em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}
.log code,
.term-body code {
  font-family: inherit;
  color: #79c0ff;
  background: none;
}

.code {
  margin: 12px 0 12px 20px;
  padding: 14px 16px;
  border: 1px solid #1b212a;
  border-radius: 10px;
  background: #060a10;
  color: #c9d1d9;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
}
.code .cm {
  color: #6e7681;
}
.code .kw {
  color: #d2a8ff;
}
.code .fn {
  color: #d2a8ff;
}
.code .op {
  color: #ff7b72;
}

.metrics {
  margin: 4px 0 4px 20px;
  display: grid;
  gap: 2px;
  color: #8b949e;
}
.metrics .g {
  color: #7ee787;
}

.prompt {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #1b212a;
  color: var(--vp-c-brand-1);
  font-weight: 700;
}
.caret {
  display: inline-block;
  width: 8px;
  height: 1.05em;
  margin-left: 6px;
  vertical-align: -2px;
  background: #6e7681;
  animation: blink 1.1s step-end infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* ===================== 分栏卡片 ===================== */
.decks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: clamp(40px, 6vw, 80px);
}
.deck {
  display: block;
  padding: 26px 28px 30px;
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  transition: transform 0.22s ease, border-color 0.22s ease,
    box-shadow 0.22s ease;
}
.deck:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 18px 44px -22px rgba(0, 0, 0, 0.6);
}
.deck-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--vp-font-family-mono);
}
.deck-count {
  font-size: 13px;
  color: var(--vp-c-brand-1);
}
.deck-arrow {
  color: var(--vp-c-text-3);
  font-size: 18px;
  transition: transform 0.22s ease, color 0.22s ease;
}
.deck:hover .deck-arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(5px);
}
.deck-title {
  margin: 16px 0 0;
  font-size: 24px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  border: 0;
  letter-spacing: -0.01em;
}
.deck-desc {
  margin: 12px 0 0;
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

/* ===================== 响应式 ===================== */
@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .decks {
    grid-template-columns: 1fr;
  }
}
</style>
