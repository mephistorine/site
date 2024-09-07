import type {RequestHandler} from "@builder.io/qwik-city"
import {createPocketbaseClient} from "~/shared"

export const onGet: RequestHandler = async ({cacheControl, headers}) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  })

  headers.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme")
  headers.set("Vary", "Sec-CH-Prefers-Color-Scheme")
  headers.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme")
}

export const onRequest: RequestHandler = async (request) => {
  await createPocketbaseClient(request)
  return request.next()
}
