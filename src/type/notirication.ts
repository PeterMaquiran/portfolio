export type FcmSubscribePayload = {
  token?: string
}

export type FcmSubscribeAck = {
  ok: boolean
  topic?: string
  error?: string
}
