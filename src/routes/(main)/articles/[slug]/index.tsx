import {component$} from "@builder.io/qwik"
import {routeLoader$} from "@builder.io/qwik-city"
import {fromPromise} from "@sweet-monads/either"
import {Article, ArticleStatus, getPocketbaseClientOrThrow} from "~/shared"

export const useArticle = routeLoader$(async (request) => {
  const pb = getPocketbaseClientOrThrow(request)
  const result = await fromPromise<Error, Article>(pb.collection("articles")
    .getFirstListItem(`slug = "${request.params.slug}" && status = "${ArticleStatus.Published}"`))

  if (result.isLeft()) {
    console.error(result.value)
    return {ok: false}
  }

  return {ok: true, value: result.value}
})

export default component$(() => {
  const article = useArticle()

  if (!article.value.ok) {
    return <>
      <h1>Error</h1>
    </>
  }

  return <>
    <h1>{article.value.value!.title}</h1>
  </>
})
