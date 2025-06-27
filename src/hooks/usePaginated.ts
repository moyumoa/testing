import { useState, useEffect, useCallback, useRef } from "react"

export interface PaginationState {
  page: number
  limit: number
  total?: number
  currentLimit?: number // 当前页的数据条数
  [key: string]: any // 允许其他属性
}

export interface UsePaginatedOptions<TParams = any> {
  defaultParams?: TParams
  defaultPagination?: PaginationState
  manual?: boolean
}

export interface UsePaginatedResult<TData, TParams> {
  data: TData[]
  loading: boolean
  pagination: PaginationState
  onSearch: (params: TParams) => void
  mergeSearch: (params: Partial<TParams>) => void
  onChangePage: (page: number, limit: number) => void
  reload: (resetPage?: boolean) => void
  setQueryParams: React.Dispatch<React.SetStateAction<TParams>>
  getData: (concat?: boolean) => void
  loadNextPage: () => void
  hasMore: boolean // 是否还有更多数据
}

export function usePaginated<TData = any, TParams = Record<string, any>>(
  fetchFn: (params: { page: number; limit: number } & TParams) => Promise<any>,
  options: UsePaginatedOptions<TParams> = {}
): UsePaginatedResult<TData, TParams> {
  const {
    defaultParams = {} as TParams,
    defaultPagination = { page: 1, limit: 10 },
    manual = false,
  } = options

  const [data, setData] = useState<TData[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)
  const [queryParams, setQueryParams] = useState<TParams>(defaultParams)

  const shouldFetch = useRef(!manual)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  const getCleanParams = useCallback(() => {
    return Object.fromEntries(
      Object.entries(queryParams as Record<string, any>).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    ) as TParams
  }, [queryParams])

  const getData = useCallback(
    async (concat = false) => {
      setLoading(true)
      const { page, limit } = pagination
      const cleanParams = getCleanParams()

      try {
        const res = await fetchFn({ page, limit, ...cleanParams })
        const result = res?.data?.rows || res?.data?.list || res?.data || []

        setData((prev) =>
          concat && page !== 1 ? [...prev, ...result] : result
        )

        setPagination((prev) => ({
          ...prev,
          total: res?.data?.total || result.length || 0,
          currentLimit: result.length || 0,
        }))
      } finally {
        setLoading(false)
      }
    },
    [pagination, getCleanParams, fetchFn]
  )

  useEffect(() => {
    if (manual) return
    if (!shouldFetch.current) return
    getData(nextIsConcat.current)
    shouldFetch.current = false
    nextIsConcat.current = false
  }, [fetchTrigger])

  const reload = (resetPage = false) => {
    shouldFetch.current = true
    if (resetPage) {
      setPagination((prev) => ({ ...prev, page: 1 }))
    }
    setFetchTrigger((prev) => prev + 1)
  }

  const onSearch = (params: TParams) => {
    shouldFetch.current = true
    setQueryParams(params)
    setPagination((prev) => ({ ...prev, page: 1 }))
    setFetchTrigger((prev) => prev + 1)
  }

  const mergeSearch = (params: Partial<TParams>) => {
    shouldFetch.current = true
    setQueryParams((prev) => ({ ...prev, ...params }))
    setPagination((prev) => ({ ...prev, page: 1 }))
    setFetchTrigger((prev) => prev + 1)
  }

  const onChangePage = (page: number, limit: number) => {
    shouldFetch.current = true
    setPagination((prev) => ({ ...prev, page, limit }))
    setFetchTrigger((prev) => prev + 1)
  }

  const nextIsConcat = useRef(false)

  const loadNextPage = () => {
    const { page, limit, total, currentLimit } = pagination
    const hasMore = currentLimit ?? 0 >= (limit || 0)
    if (hasMore && !loading) {
      shouldFetch.current = true
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
      setFetchTrigger((prev) => prev + 1)

      // ✅ 设置 fetch 是合并模式
      nextIsConcat.current = true
    }
  }

  const hasMore = (pagination.currentLimit ?? 0) >= (pagination.limit || 0)

  return {
    data,
    loading,
    pagination,
    onSearch,
    mergeSearch,
    onChangePage,
    reload,
    setQueryParams,
    getData,
    loadNextPage,
    hasMore, // 是否还有更多数据
  }
}
