import { useCallback } from "react"

const useApi = (basePath: string = "/api") => {
  const secretToken: string | undefined =
    process.env.NEXT_PUBLIC_API_SECRET_TOKEN

  const fetchApi = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
      body: Record<string, unknown> | null = null
    ): Promise<[unknown, Error | null]> => {
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: secretToken || "",
      })

      const config: RequestInit = {
        method,
        headers,
      }

      if (body) {
        config.body = JSON.stringify(body)
      }

      try {
        const response = await fetch(`${basePath}${endpoint}`, config)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong")
        }
        return [data, null]
      } catch (error) {
        console.error("API call error:", error)
        return [
          null,
          error instanceof Error ? error : new Error("Unknown error"),
        ]
      }
    },
    [basePath, secretToken]
  )

  const listApi = (folder: string) => fetchApi(`/${folder}`)
  const deleteApi = (id: string, folder: string) =>
    fetchApi(`/${folder}/${id}`, "DELETE")
  const createApi = (folder: string, data: Record<string, unknown>) =>
    fetchApi(`/${folder}`, "POST", data)
  const updateApi = (
    id: string,
    folder: string,
    data: Record<string, unknown>
  ) => fetchApi(`/${folder}/${id}`, "PATCH", data)
  const updateAvailableApi = (
    id: string,
    folder: string,
    data: Record<string, unknown>
  ) => fetchApi(`/${folder}/${id}/status`, "PATCH", data)
  const deleteMultiIdsApi = (ids: string, folder: string) => {
    return fetchApi(`/${folder}/multi-ids/${ids}`, "DELETE")
  }
  const deleteMultiPageIdsApi = (ids: string, folder: string) => {
    return fetchApi(`/${folder}/multi-ids/pageId/${ids}`, "DELETE")
  }

  return {
    listApi,
    deleteApi,
    createApi,
    updateApi,
    updateAvailableApi,
    deleteMultiIdsApi,
    deleteMultiPageIdsApi,
  }
}

export default useApi
