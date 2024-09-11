import {component$, useComputed$} from "@builder.io/qwik"
import DOMPurify from "isomorphic-dompurify"
import {Marked} from "marked"
import markedShiki from "marked-shiki"
import {createCssVariablesTheme, createHighlighter} from "shiki"

const myTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true
})

const highlighter = await createHighlighter({
  langs: ["js", "css", "typescript", "angular-html"],
  themes: [myTheme]
})

const marked = new Marked()
  .use({
    hooks: {
      postprocess(html: string): string {
        return DOMPurify.sanitize(html)
      }
    }
  })
  .use(
    markedShiki({
      highlight: (code, lang, props) => {
        return highlighter.codeToHtml(code, {
          lang,
          theme: "css-variables",
          meta: { __raw: props.join(' ') },
          transformers: []
        })
      }
    })
  )

type ArticlePageProps = {
  body: string
}

export const ArticlePage = component$<ArticlePageProps>((props) => {
  const resultHtml = useComputed$(() => {
    return marked.parse(props.body, {
      async: false
    })
  })

  return <div dangerouslySetInnerHTML={resultHtml.value}></div>
})
