import axios from "axios"
import { NextResponse, NextRequest } from "next/server"

export async function POST (req: NextRequest) {
  const body = await req.json()
  if (!req.body) {
    return NextResponse.json({
      message: "Bad Request",
    }, {
      status: 400,
    })
  }
  if (!("liffAccessToken" in body)) {
    return NextResponse.json({
      message: "Bad Request",
    }, {
      status: 400,
    })
  }
  const { liffAccessToken } = await body
  try {
    const { data: { notificationToken } } = await axios.post<{ notificationToken: string, remainingCount: number, expiresIn: number, sessionId: string }>("https://api.line.me/message/v3/notifier/token", {
      liffAccessToken,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
      }
    })
    const {} = await axios.post<{ notificationToken: string, remainingCount: number, expiresIn: number, sessionId: string }>("https://api.line.me/message/v3/notifier/send?target=service", {
      templateName: "couponnoti_s_c_ja",
      params: {
        btn1_url: "https://google.com",
      },
      notificationToken,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
      }
    })
    return NextResponse.json({
      message: "message sent",
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({
      message: "message sent",
    }, {
      status: 500,
    })
  }
}