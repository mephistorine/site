import {component$} from "@builder.io/qwik"
import {routeLoader$} from "@builder.io/qwik-city"
import {getPocketbaseClientOrThrow} from "~/shared"

const useArticle = routeLoader$(async (request) => {
  const pbClient = getPocketbaseClientOrThrow(request)
})

export default component$(() => {
  return <h1>Hello</h1>
})
