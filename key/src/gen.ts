import jose from "node-jose"
import fs from "fs"
import axios from "axios"
import "dotenv/config"

const channelId = process.env.CHANNEL_ID
const kid = process.env.KID
if (!channelId || !kid) {
  throw new Error("env is not set properly.")
}
const privateKey = JSON.parse(fs.readFileSync("./private.key", "utf8"))

// JWT spec
// https://developers.line.biz/ja/docs/messaging-api/generate-json-web-token/#generate-jwt
const header = {
  alg: "RS256",
  typ: "JWT",
  kid: kid,
}

const payload = {
  iss: channelId,
  sub: channelId,
  aud: "https://api.line.me/",
  exp: Math.floor(new Date().getTime() / 1000) + 60 * 30,
  token_exp: 60 * 60 * 24 * 30,
}

;(async () => {
  const result = await jose.JWS.createSign({
    format: "compact", fields: header
  },
  privateKey).update(JSON.stringify(payload)).final()
  if (typeof result !== "string") {
    throw new Error("result (JWT) is not string")
  }
  const params = new URLSearchParams()
  params.append("grant_type", "client_credentials")
  params.append("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer")
  params.append("client_assertion", result)
  const { data } = await axios.post("https://api.line.me/oauth2/v2.1/token", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  console.log(data)
})()