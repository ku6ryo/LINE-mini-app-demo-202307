"use client"
import type { liff } from "@line/liff"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [lang, setLang] = useState<string | null>(null)
  const [os, setOs] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [pictureUrl, setPictureUrl] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [liffObject, setLiffObject] = useState<typeof liff | null>(null)
  useEffect(() => {
    ;(async () => {
      setStartDate(new Date())
      const { default: liff } = await import("@line/liff")
      setStatusMessage("LIFF init...");
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
        setLiffObject(liff)
        setStatusMessage("LIFF init done")
      } catch (error) {
        if (error instanceof Error) {
          setStatusMessage(error.message)
        } else {
          setStatusMessage("Unknown error")
        }
      }
    })()
  }, []);
  useEffect(() => {
    if (!liffObject) {
      return
    }
    ;(async () => {
      setLang(liffObject.getLanguage())
      setOs(liffObject.getOS() as string)
      const profile = await liffObject.getProfile()
      setDisplayName(profile.displayName)
      setPictureUrl(profile.pictureUrl || null)
    })()
  }, [liffObject]);
  const onSendMessageClick = async () => {
    if (liffObject) {
      setStatusMessage("Sending message...")
      const token = await liffObject.getAccessToken()
      try {
        await axios.post("/api/sendMessage", {
          liffAccessToken: token,
        })
        setStatusMessage("Message sent")
      } catch (error) {
        if (error instanceof Error) {
          setStatusMessage(error.message)
        } else {
          setStatusMessage("Unknown error")
        }
      }
    }
  }
  return (
    <main>
      <div>status: {statusMessage}</div>
      {liffObject && (
        <>
          <div>Start time: {startDate?.toISOString()}</div>
          <div>Lang: {lang}</div>
          <div>OS: {os}</div>
          <div>Display name: {displayName}</div>
          <div>
            {pictureUrl && (
              <img src={pictureUrl} width={50} />
            )}
          </div>
          <div>
            <button onClick={onSendMessageClick}>send message</button>
          </div>
        </>
      )}
    </main>
  )
}
