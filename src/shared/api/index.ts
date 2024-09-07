import {CookieOptions, RequestEventBase} from "@builder.io/qwik-city"
import {fromNullable} from "@sweet-monads/maybe"
import PocketbaseClient, {AuthModel, BaseModel, RecordService} from "pocketbase"
import {PB_CLIENT_KEY, PB_COOKIE_KEY} from "../constants"
import {Article} from "../domain"

type PBAuthData = {
  readonly token: string
  readonly model: AuthModel
}

export const PB_AUTH_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  secure: true,
  sameSite: "strict",
  httpOnly: false,
  // 100 years
  maxAge: [5_200, "weeks"],
}

export interface MephiPocketbaseClient extends PocketbaseClient {
  collection(idOrName: "articles"): RecordService<Article>
  collection(idOrName: string): RecordService<BaseModel>
}

export function getPocketbaseClientOrThrow(
  request: RequestEventBase,
): MephiPocketbaseClient {
  return fromNullable(request.sharedMap.get(PB_CLIENT_KEY)).unwrap(
    () => new Error("Pocketbase must be defined"),
  )
}

export async function createPocketbaseClient(request: RequestEventBase) {
  const pocketbaseServerUrl = fromNullable(
    request.env.get("VITE_POCKETBASE_URL"),
  )

  if (pocketbaseServerUrl.isNone()) {
    throw new Error("VITE_POCKETBASE_URL not defined")
  }

  const pocketbaseClient = new PocketbaseClient(pocketbaseServerUrl.unwrap())

  request.sharedMap.set(PB_CLIENT_KEY, pocketbaseClient)

  const authCookie = fromNullable(request.cookie.get(PB_COOKIE_KEY)).map(
    (cookie) => cookie.json<PBAuthData>(),
  )

  if (authCookie.isJust()) {
    const {token, model} = authCookie.unwrap()
    pocketbaseClient.authStore.save(token, model)
  }

  try {
    pocketbaseClient.authStore.isValid &&
      (await pocketbaseClient.collection("users").authRefresh())
  } catch (error) {
    console.error(error)
    pocketbaseClient.authStore.clear()
  }

  request.cookie.set(
    PB_COOKIE_KEY,
    {
      token: pocketbaseClient.authStore.token,
      model: pocketbaseClient.authStore.model,
    } as PBAuthData,
    PB_AUTH_COOKIE_OPTIONS,
  )

  pocketbaseClient.autoCancellation(false)

  return pocketbaseClient as MephiPocketbaseClient
}
