"use client"

import { useState, useRef, FormEvent, ChangeEvent } from "react"
import { Upload, Music, ImageIcon, Save, X, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import "../styles/uploadsong.css"
import { songService } from "../services/api"

interface UploadFormData {
  name: string
  musicStyle: string
  releaseDate: string
  singerId?: number
  singerName?: string
}

const UploadSong = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    name: "",
    musicStyle: "",
    releaseDate: new Date().toISOString().split("T")[0],
    singerName: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const musicStyles = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Electronic",
    "Jazz",
    "Classical",
    "Country",
    "Folk",
    "Reggae",
    "Blues",
    "Metal",
    "Punk",
    "Soul",
    "Funk",
    "Disco",
    "Ambient",
    "Indie",
    "Alternative",
    "Other",
  ]

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith("audio/")) {
        setError("Please select a valid audio file")
        return
      }
      
      setAudioFile(file)
      
      // Create audio preview URL
      const audioUrl = URL.createObjectURL(file)
      setAudioPreview(audioUrl)
      
      // Clear any previous errors
      setError(null)
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }
      
      setImageFile(file)
      
      // Create image preview URL
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      
      // Clear any previous errors
      setError(null)
    }
  }

  const triggerAudioInput = () => {
    if (audioInputRef.current) {
      audioInputRef.current.click()
    }
  }

  const triggerImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

  const removeAudio = () => {
    setAudioFile(null)
    setAudioPreview(null)
    if (audioInputRef.current) {
      audioInputRef.current.value = ""
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const calculateSongLength = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.src = URL.createObjectURL(file)
      
      audio.onloadedmetadata = () => {
        const duration = audio.duration
        const hours = Math.floor(duration / 3600)
        const minutes = Math.floor((duration % 3600) / 60)
        const seconds = Math.floor(duration % 60)
        
        const formattedHours = hours.toString().padStart(2, "0")
        const formattedMinutes = minutes.toString().padStart(2, "0")
        const formattedSeconds = seconds.toString().padStart(2, "0")
        
        resolve(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`)
      }
      
      audio.onerror = () => {
        resolve("00:03:00") // Default fallback duration
      }
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.musicStyle || !audioFile) {
      setError("Please fill in all required fields and upload an audio file")
      return
    }
    
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)
    
    try {
      // Calculate song length from audio file
      const songLength = await calculateSongLength(audioFile)
      
      // Create form data for upload
      const uploadData = new FormData()
      uploadData.append("name", formData.name)
      uploadData.append("musicStyle", formData.musicStyle)
      uploadData.append("releaseDate", formData.releaseDate)
      uploadData.append("songLength", songLength)
      
      if (formData.singerName) {
        uploadData.append("singerName", formData.singerName)
      }
      
      if (audioFile) {
        uploadData.append("audioFile", audioFile)
      }
      
      if (imageFile) {
        uploadData.append("imageFile", imageFile)
      }
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 300)
      
      // Upload song
      await songService.uploadSong(uploadData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(progress)
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadSuccess(true)
      
      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          name: "",
          musicStyle: "",
          releaseDate: new Date().toISOString().split("T")[0],
          singerName: "",
        })
        setAudioFile(null)
        setImageFile(null)
        setAudioPreview(null)
        setImagePreview(null)
        setUploadProgress(0)
        setUploadSuccess(false)
        setIsUploading(false)
      }, 3000)
      
    } catch (err) {
      console.error("Error uploading song:", err)
      setError("Failed to upload song. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-song-container">
      <div className="upload-song-header">
        <h2>Upload Your Music</h2>
        <p className="upload-description">
          Share your music with the world. Upload your songs and add them to your personal collection.
        </p>
      </div>

      {error && (
        <div className="upload-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="upload-success">
          <CheckCircle size={18} />
          <span>Your song has been uploaded successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-form-grid">
          <div className="upload-form-left">
            <div className="form-group">
              <label htmlFor="name">Song Title *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter song title"
                required
                disabled={isUploading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="musicStyle">Genre *</label>
              <select
                id="musicStyle"
                name="musicStyle"
                value={formData.musicStyle}
                onChange={handleInputChange}
                required
                disabled={isUploading}
              >
                <option value="">Select a genre</option>
                {musicStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="singerName">Artist Name</label>
              <input
                type="text"
                id="singerName"
                name="singerName"
                value={formData.singerName}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                disabled={isUploading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="upload-form-right">
            <div className="upload-files">
              <div className="upload-file-section">
                <h3>
                  <Music size={18} />
                  <span>Audio File *</span>
                </h3>
                <input
                  type="file"
                  ref={audioInputRef}
                  onChange={handleAudioChange}
                  accept="audio/*"
                  style={{ display: "none" }}
                  disabled={isUploading}
                />

                {!audioFile ? (
                  <div className="upload-placeholder" onClick={triggerAudioInput}>
                    <Upload size={32} />
                    <p>Click to upload audio file</p>
                    <span>MP3, WAV, FLAC (max 50MB)</span>
                  </div>
                ) : (
                  <div className="file-preview audio-preview">
                    <div className="file-info">
                      <Music size={24} />
                      <div className="file-details">
                        <p>{audioFile.name}</p>
                        <span>{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    </div>
                    {audioPreview && (
                      <audio controls className="audio-player">
                        <source src={audioPreview} type={audioFile.type} />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    <button
                      type="button"
                      className="remove-file-button"
                      onClick={removeAudio}
                      disabled={isUploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="upload-file-section">
                <h3>
                  <ImageIcon size={18} />
                  <span>Cover Image (Optional)</span>
                </h3>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={isUploading}
                />

                {!imageFile ? (
                  <div className="upload-placeholder" onClick={triggerImageInput}>
                    <Upload size={32} />
                    <p>Click to upload cover image</p>
                    <span>JPG, PNG, WebP (max 5MB)</span>
                  </div>
                ) : (
                  <div className="file-preview image-preview">
                    {imagePreview && <img src={imagePreview || "/placeholder.svg"} alt="Cover preview" />}
                    <button
                      type="button"
                      className="remove-file-button"
                      onClick={removeImage}
                      disabled={isUploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <span>{uploadProgress}% Uploaded</span>
          </div>
        )}

        <div className="upload-actions">
          <button type="submit" className="upload-submit-button" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader size={18} className="spinner" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Upload Song</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadSong
