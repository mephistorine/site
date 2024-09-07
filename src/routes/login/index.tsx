import {$, component$} from "@builder.io/qwik"
import {
  DocumentHead,
  Form,
  routeAction$,
  useNavigate,
  z,
  zod$
} from "@builder.io/qwik-city"
import {fromPromise} from "@sweet-monads/either"
import {
  getPocketbaseClientOrThrow,
  PB_AUTH_COOKIE_OPTIONS,
  PB_COOKIE_KEY
} from "~/shared"

export const head: DocumentHead = {
  title: "Вход",
}

export const useLogin = routeAction$(
  async ({usernameOrEmail, password}, request) => {
    const pocketbaseClient = getPocketbaseClientOrThrow(request)
    const loginResult = await fromPromise(
      pocketbaseClient
        .collection("users")
        .authWithPassword(usernameOrEmail, password),
    )

    if (loginResult.isLeft()) {
      return request.fail(400, {
        message: `Auth error`,
      })
    }

    const {token, record} = loginResult.unwrap()

    request.cookie.set(
      PB_COOKIE_KEY,
      {
        token: token,
        model: record,
      },
      PB_AUTH_COOKIE_OPTIONS,
    )

    return {
      success: true,
    }
  },
  zod$({
    usernameOrEmail: z.string(),
    password: z.string(),
  }),
)

export default component$(() => {
  const login = useLogin()
  const navigateByUrl = useNavigate()

  const onSubmitCompleted = $(() => {
    login.value?.success && navigateByUrl("/")
  })

  return (
    <div>
      <h1>Вход</h1>
      <Form action={login} onSubmitCompleted$={onSubmitCompleted}>
        <label>
          <span>Имя пользователя</span>
          <input type="text" name="usernameOrEmail" required />
        </label>

        <label>
          <span>Пароль</span>
          <input type="password" name="password" required />
        </label>

        <button type="submit">Войти</button>
      </Form>
    </div>
  )
})
