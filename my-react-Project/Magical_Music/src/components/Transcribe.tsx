"use client"

import type React from "react"
import { useState, useRef } from "react"
import axios from "axios"
import { Mic, Upload, FileText, Loader, Download, Copy, CheckCircle, Music, Mail } from "lucide-react"
import "../styles/transcribe.css"
import type { TranscriptionResult } from "../types"

const Transcribe = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null)
  const [copied, setCopied] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = async () => {
    setIsRecording(true)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data)
    }

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/mpeg" })
      setAudioFile(new File([audioBlob], "recording.mp3", { type: "audio/mpeg" }))
      audioChunks.current = []
    }

    mediaRecorderRef.current.start()
  }

  const stopRecording = () => {
    setIsRecording(false)
    mediaRecorderRef.current?.stop()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const transcribeAudio = async () => {
    if (!audioFile) return

    setIsTranscribing(true)

    // Send the audio file to an API for transcription using Axios
    const formData = new FormData()
    formData.append("audio", audioFile)

    try {
      const response = await axios.post("YOUR_TRANSCRIPTION_API_URL", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      const result: TranscriptionResult = response.data
      setTranscriptionResult(result)
    } catch (error) {
      console.error("Error during transcription:", error)
    } finally {
      setIsTranscribing(false)
    }
  }

  const copyToClipboard = () => {
    if (transcriptionResult) {
      navigator.clipboard.writeText(transcriptionResult.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadTranscription = () => {
    if (!transcriptionResult) return

    const element = document.createElement("a")
    const file = new Blob([transcriptionResult.text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "transcription.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const sendTranscriptionByEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transcriptionResult || !email) return

    setIsSendingEmail(true)

    try {
      await axios.post("YOUR_EMAIL_API_URL", {
        email,
        transcription: transcriptionResult.text,
      })
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 5000)
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="transcribe-container">
      {/* ... (remaining JSX code unchanged) */}
    </div>
  )
}

export default Transcribe
