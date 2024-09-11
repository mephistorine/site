import {component$} from "@builder.io/qwik"
import {Link, routeLoader$} from "@builder.io/qwik-city"
import {fromPromise} from "@sweet-monads/either"
import {Article, ArticleStatus, getPocketbaseClientOrThrow} from "~/shared"

export const useDraftArticles = routeLoader$(async (request) => {
  const pb = getPocketbaseClientOrThrow(request)
  const result = await fromPromise<Error, Article[]>(pb.collection("articles")
    .getFullList({filter: `status = "${ArticleStatus.Draft}"`}))

  if (result.isLeft()) {
    console.error(result.value)
    return null
  }

  return result.value
})

export default component$(() => {
  const articles = useDraftArticles()
  return <main>
    <div class="container">
      <h1>Drafts</h1>
      <ul>
        {articles.value?.map((article) => {
          return <li key={article.id}>
            <Link href={`/drafts/${article.slug}`}>{article.title}</Link>
          </li>
        })}
      </ul>
    </div>
  </main>
})
