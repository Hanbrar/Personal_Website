import crypto from "node:crypto"
import { nowUnix } from "./config.js"

function sign(input, secret) {
  return crypto.createHmac("sha256", secret).update(input).digest("base64url")
}

export function encodeSigned(payloadObject, secret) {
  const payload = Buffer.from(JSON.stringify(payloadObject), "utf8").toString("base64url")
  const signature = sign(payload, secret)
  return `${payload}.${signature}`
}

export function decodeSigned(token, secret) {
  if (!token || typeof token !== "string") return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [payload, signature] = parts
  const expected = sign(payload, secret)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (signatureBuffer.length !== expectedBuffer.length) return null
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    return parsed
  } catch {
    return null
  }
}

export function createSessionPayload({ username, accessToken, ttlSeconds }) {
  const exp = nowUnix() + ttlSeconds
  return { username, accessToken, exp }
}

export function isExpired(payload) {
  if (!payload || typeof payload.exp !== "number") return true
  return nowUnix() >= payload.exp
}
