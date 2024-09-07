import {component$, useStylesScoped$} from "@builder.io/qwik"
import {Link} from "@builder.io/qwik-city"
import headerStyles from "./header.css?inline"

export const Header = component$(() => {
  useStylesScoped$(headerStyles)

  return (
    <header class="header container">
      <div class="actions-container">
        <h3 class="title">
          <Link href="/">Булатов Сэм</Link>
        </h3>

        <div>
          <Link href="/new">Новая статья</Link>
        </div>
      </div>

      <nav class="navigation">
        <Link href="/articles">Статьи</Link>
        <Link href="/tags">Метки</Link>
      </nav>
    </header>
  )
})
