<script setup lang="ts">
import { useData } from 'vitepress'

// 数据由 config.ts 的 transformPageData 构建期写入 frontmatter，无客户端闪烁。
const { frontmatter } = useData()
</script>

<template>
  <div class="doc-topbar" aria-hidden="true">
    <span class="tw-dots"><i /><i /><i /></span>
    <span class="tw-crumb">
      <span class="tw-user">claude</span>
      <span class="tw-tilde">~</span>
      {{ frontmatter.crumb }}
    </span>
    <span v-if="frontmatter.readingTime" class="tw-read">
      — {{ frontmatter.readingTime }} min read
    </span>
  </div>
</template>
