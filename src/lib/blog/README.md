# Blog 模块架构

现代化的博客数据处理模块，基于 Next.js 13+ App Router 和 React Server Components。

## 目录结构

```
src/lib/blog/
├── types.ts       # 类型定义
├── parser.ts      # Frontmatter 解析器
├── helpers.ts     # 辅助函数
├── server.ts      # 服务器端数据获取
└── index.ts       # 统一导出
```

## 核心功能

### 类型定义 (types.ts)

```typescript
interface BlogMetadata     // 博客元数据
interface BlogListItem     // 博客列表项
interface BlogPost         // 完整博客文章
interface ParsedFrontmatter // 解析后的 frontmatter
```

### Frontmatter 解析器 (parser.ts)

- 兼容 Windows (CRLF) 和 Unix (LF) 换行符
- 解析 YAML frontmatter
- 支持标题、日期、分类、摘要、封面等字段

### 辅助函数 (helpers.ts)

- `extractTextSummary()` - 从 Markdown 提取文本摘要
- `extractFirstImage()` - 提取首图
- `enrichMetadata()` - 自动补充元数据

### 服务器端数据获取 (server.ts)

- `getBlogPost(slug)` - 获取单篇博客
- `getBlogList()` - 获取博客列表
- `getBlogSlugs()` - 获取所有博客 slug
- 使用 React `cache()` 进行请求去重
- 自动按日期排序

## 使用示例

### 在页面组件中使用

```typescript
import { getBlogPost, getBlogList } from '@/lib/blog';

// 博客列表页
export default async function BlogsPage() {
  const blogs = await getBlogList();
  return <BlogList blogs={blogs} />;
}

// 博客详情页
export default async function BlogPage({ params }) {
  const blog = await getBlogPost(params.slug);
  return <BlogPreview {...blog} />;
}
```

### 生成静态路径

```typescript
export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ blog: slug }));
}
```

## 架构优势

1. **模块化设计** - 职责分离，易于维护
2. **类型安全** - 完整的 TypeScript 类型定义
3. **性能优化** - React cache() 自动去重请求
4. **跨平台兼容** - 支持 Windows/Mac/Linux 换行符
5. **服务器组件优先** - 充分利用 RSC 优势
6. **静态生成支持** - 可生成静态页面提升性能

## 迁移说明

从旧架构迁移：

- ✅ 移除 `load-blog-server.ts`
- ✅ 移除 `load-blog.ts`
- ✅ 博客详情页改为服务器组件
- ✅ 统一使用 `@/lib/blog` 导入
