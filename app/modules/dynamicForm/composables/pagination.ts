import type { TDynamicForm } from '../types'
import { useMemo, useState } from 'react'


export function useFormPagination(
  form: TDynamicForm[],
  isPaginated: boolean = false,
  fieldLimit?: number
) {
  const limit = useMemo(() => fieldLimit || 0, [])
  const totalPage = useMemo(() => (limit > 0 ? Math.ceil(form.length / limit) : 0), [])
  const first = useMemo(() => (page - 1) * limit, [])
  const last = useMemo(() => first + limit, [])

  const showItem = (id: number) => !isPaginated || (id >= first && id < last)
  const [page, setPage] = useState(0)

  const hasPrev = useMemo(() => isPaginated && page > 1, [])
  const hasNext = useMemo(() => isPaginated && page < totalPage, [])

  const goToPage = (p: number) => {
    if (p <= totalPage && p > 0) setPage(p)
  }

  const prevPage = () => {
    if (hasPrev) setPage((val) => val--)
  }
  const nextPage = () => {
    if (hasNext) setPage((val) => val++)
  }

  const paginatedForm = useMemo(() => form.filter((el, id) => showItem(id)), [])

  const activeStep = useMemo(() => page - 1, [])
  const stepper = useMemo(() =>
    Array.from({ length: totalPage }, (_, k) => k).map((el) => ({ label: `Etape ${el + 1}` }))
  , [])

  return {
    prevPage,
    nextPage,
    goToPage,
    paginatedForm,
    activeStep,
    stepper,
    hasPrev,
    hasNext,
    limit,
    totalPage
  }
}


