import {component$, useStylesScoped$, useVisibleTask$} from "@builder.io/qwik"
import {
  DocumentHead,
  Form,
  Link,
  routeAction$,
  useNavigate,
  z,
  zod$
} from "@builder.io/qwik-city"
import {ArticleStatus, getPocketbaseClientOrThrow} from "~/shared"
import componentStyles from "./new.css?inline"

export const head: DocumentHead = {
  title: "Новая статья"
}

export const useCreateArticle = routeAction$(
  async (data, request) => {
    const pbClient = getPocketbaseClientOrThrow(request)
    const result = await pbClient.collection("articles").create({
      title: data.title,
      slug: data.slug,
      body: data.body,
      userId: pbClient.authStore.model!.id,
      status: ArticleStatus.Draft
    })
    return {
      success: true,
      slug: result.slug
    }
  },
  zod$({
    title: z.string(),
    body: z.string(),
    slug: z.string()
  })
)

export default component$(() => {
  useStylesScoped$(componentStyles);
  const navigate = useNavigate()
  const articleCreationAction = useCreateArticle()

  useVisibleTask$(({track}) => {
    track(() => articleCreationAction.value)

    if (articleCreationAction.value?.slug) {
      navigate(`/drafts/${articleCreationAction.value.slug}`)
    }
  }, {strategy: "document-ready"})

  return <>
    <header>
      <div class="header container">
        <Link href="/">На главную</Link>
      </div>
    </header>
    <main>
      <div class="main container">
        <h1 class="title">Новая статья</h1>
         <Form class="form" action={articleCreationAction}>
           <label class="label">
             <span class="name">Название</span>
             <input class="input" type="text" autocomplete="off" name="title" />
           </label>

           <div class="slug-container">
             <span>https://mephi.dev/</span>
             <input type="text" name="slug" />
           </div>

           <label class="label">
             <span class="name">Содержание</span>
             <textarea class="input" name="body"></textarea>
           </label>

           <button type="submit" class="button">
             {articleCreationAction.isRunning ? "Загрузка..." : "Сохранить и посмотреть"}
           </button>
         </Form>
      </div>
    </main>
  </>
})
