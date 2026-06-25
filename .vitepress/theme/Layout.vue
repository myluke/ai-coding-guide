<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import DocTopBar from './components/DocTopBar.vue'
import Home from './components/Home.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <!-- 文章页：渲染在 .content-container 内、<main> 之前；仅带 crumb 的页出现 -->
    <template #doc-before>
      <DocTopBar v-if="frontmatter.crumb" />
    </template>

    <!-- 首页：自定义 Hero + 卡片，注入到 home 布局顶部，保留导航栏 -->
    <template #home-hero-before>
      <Home />
    </template>
  </Layout>
</template>
