import {component$} from "@builder.io/qwik"
import {
  routeAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$
} from "@builder.io/qwik-city"
import {fromPromise} from "@sweet-monads/either"
import {Article, ArticleStatus, getPocketbaseClientOrThrow} from "~/shared"

export const useDraftArticle = routeLoader$(async (request) => {
  const pb = getPocketbaseClientOrThrow(request)
  const result = await fromPromise<Error, Article>(pb.collection("articles")
    .getFirstListItem(`slug = "${request.params.slug}" && status = "${ArticleStatus.Draft}"`))

  if (result.isLeft()) {
    console.error(result.value)
    return null
  }

  return result.value
})

export const usePublishArticle = routeAction$(
  async (data, request) => {
    const pb = getPocketbaseClientOrThrow(request)
    const result = await fromPromise(pb.collection("articles").update(data.id, {
      status: ArticleStatus.Published
    }))

    if (result.isLeft()) {
      console.error(result.value)
      return {success: false}
    }

    return {success: true, slug: result.value.slug}
  },
  zod$({ id: z.string() })
)

export default component$(() => {
  const navigate = useNavigate()
  const article = useDraftArticle()
  const articlePublishAction = usePublishArticle()

  if (article.value === null) {
    return <>
      <h1>Not found</h1>
      <h3>Страница не найдена</h3>
    </>
  }

  return <>
    <h1>{article.value.title}</h1>

    <button onClick$={() => {
      articlePublishAction
        .submit({id: article.value.id})
        .then(({value}) => {
          if (!value.slug) {
            return
          }

          navigate(`/articles/${value.slug}`)
        })
    }}>{articlePublishAction.isRunning ? "Публикуется..." : "Опубликовать"}</button>
  </>
})
