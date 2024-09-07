export const enum ArticleStatus {
  Published = "PUBLISHED",
  Draft = "DRAFT"
}

export type Article = {
  readonly id: string
  readonly title: string
  readonly slug: string
  readonly body: string
  readonly userId: string
  readonly status: ArticleStatus
  readonly commentsEnabled: boolean
  readonly pinned: boolean
  readonly tagIds: readonly string[]
  readonly description: string
  readonly poster: string
}
