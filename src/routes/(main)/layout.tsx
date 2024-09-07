import {component$, Slot} from "@builder.io/qwik"
import {Footer, Header} from "~/components"

export default component$(() => {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  )
})
