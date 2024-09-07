import {component$, useStylesScoped$} from "@builder.io/qwik"
import {routeLoader$} from "@builder.io/qwik-city"
import {getPocketbaseClientOrThrow} from "~/shared"
import indexStyles from "./index.css?inline"

export const useLastArticles = routeLoader$(async (request) => {
  const pocketbaseClient = getPocketbaseClientOrThrow(request)
  return pocketbaseClient.collection("articles").getList(1, 5, {
    sort: "-created",
  })
})

export default component$(() => {
  useStylesScoped$(indexStyles)
  const articles = useLastArticles()

  return (
    <>
      <main>
        <div class="container">
          <h1 class="title">
            Привет, я Сэм. <br /> Фронтенд разработчик
            <br />в Конструкторе сайтов от Т-Банка
          </h1>
          <p>
            Организатор мероприятий <a href="https://krd.dev">krd.dev</a> в
            Краснодаре. Админю чат технологии RxJS в телеграм (
            <a href="https://t.me/rxjs_ru">@rxjs_ru</a>). А в свободное ото сна
            время копаюсь в различных Open Source проектах, катаюсь на ролликах
            и читаю мангу.
          </p>

          <section>
            <h2>Новое</h2>
            <ul>
              {articles.value.items.map((article) => {
                return <li key={article.id}>{article.title}</li>
              })}
            </ul>
          </section>
        </div>
      </main>
    </>
  )
})
