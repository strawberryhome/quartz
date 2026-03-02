import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path";

const recentPosts = Component.RecentNotes({
  title: "Recent Posts",
  limit: 4,
  linkToMore: "posts/" as SimpleSlug,
  filter: (note) => note.slug!.startsWith("posts/") && note.slug! !== "posts/index" && !note.frontmatter?.noindex,
});

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "strawberryhome/blog",
        repoId: "R_kgDORTRXAg",
        category: "Posts",
        categoryId: "DIC_kwDORTRXAs4C2ubI",
        mapping: "og:title",
      },
    }),
    Component.HorizontalRule(),
    Component.MobileOnly(recentPosts)
  ],
  footer: Component.Footer({
    links: {
      "Home": "https://blog.strawberryhome.org",
      "Account": "https://auth.strawberryhome.org",
      "Apps": "https://auth.strawberryhome.org/settings/apps",
      "GitHub": "https://github.com/strawberryhome",
      "RSS": "https://blog.strawberryhome.org/feed.xml",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        // { Component: Component.ReaderMode() },
      ],
    }),
    // Component.Explorer(),
    Component.DesktopOnly(recentPosts)
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta()
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    // Component.Explorer(),
    Component.DesktopOnly(recentPosts)
  ],
  right: [],
}
