export interface User {
  id: number
  name: string
  email: string
  password?: string
  role: string
  songs?: Song[]
}

export interface UserDTO {
  name: string
  email: string
  password: string
}

export interface Singer {
  id: number
  name: string
  songs?: Song[]
}

export interface SingerDTO {
  name: string
}

export interface Song {
  id: number
  name: string
  musicStyle: string
  songLength: string // TimeSpan represented as string "00:00:00"
  releaseDate: string // DateTime represented as ISO string
  imageUrl: string
  singerId: number
  singer?: Singer
  users?: User[]
  liked?: boolean
}

export interface SongDTO {
  name: string
  musicStyle: string
  songLength: string // TimeSpan represented as string "00:00:00"
  releaseDate: string // DateTime represented as ISO string
  imageUrl: string
  singerId: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface TranscriptionResult {
  text: string
  confidence: number
}

export interface SearchResult {
  songs: Song[]
  totalResults: number
  page: number
  totalPages: number
}
