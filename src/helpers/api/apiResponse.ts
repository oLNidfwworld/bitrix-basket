type ApiResponse<T = unknown> = {
  data: Array<T>
  message: string
  status: boolean
}

export type { ApiResponse }
