import {component$, useStylesScoped$} from "@builder.io/qwik"
import footerStyles from "./footer.css?inline"

export const Footer = component$(() => {
  useStylesScoped$(footerStyles)

  return (
    <footer class="container">
      <ul class="author-contacts">
        <li>
          <a href="">Телеграм</a>
        </li>
        <li>
          <a href="">Гитхаб</a>
        </li>
      </ul>
    </footer>
  )
})
