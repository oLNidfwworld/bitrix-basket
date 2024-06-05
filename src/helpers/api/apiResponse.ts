type ApiResponse<T = unknown> = {
  data: T
  message: string
  status: boolean
}

export type { ApiResponse }
