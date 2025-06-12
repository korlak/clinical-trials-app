'use client'
import { useState } from 'react'
import { useSearchStudiesQuery } from '../redux/studiesApi'
import StudiesList from './StudiesList'

export default function StudiesSearchContainer() {
    const [filters, setFilters] = useState({ nctId: '', briefTitle: '', condition: '' })
    const [pageToken, setPageToken] = useState<string | undefined>(undefined)
    const { data, isLoading, error } = useSearchStudiesQuery({
        nctId: filters.nctId || undefined,
        briefTitle: filters.briefTitle || undefined,
        condition: filters.condition || undefined,
        pageToken
    })
    const [onlyBriefTitle, setOnlyBriefTitle] = useState(false);
    const nextPageToken = data?.nextPageToken

    return (
        <>
            <input
                type="text"
                placeholder="NCD Title"
                value={filters.nctId}
                onChange={e => setFilters(f => ({ ...f, nctId: e.target.value }))}
                className="border p-2 rounded mr-2"
            />
            <input
                type="text"
                placeholder="Brief Title"
                value={filters.briefTitle}
                onChange={e => setFilters(f => ({ ...f, briefTitle: e.target.value }))}
                className="border p-2 rounded mr-2"
            />
            <input
                type="text"
                placeholder="Condition"
                value={filters.condition}
                onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}
                className="border p-2 rounded mr-2"
            />

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={onlyBriefTitle}
                    onChange={(e) => setOnlyBriefTitle(e.target.checked)}
                />
                <span>Шукати тільки в заголовку</span>
            </label>
            {nextPageToken && (
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setPageToken(nextPageToken)}
                >
                    Наступна сторінка
                </button>
            )}
            {pageToken && (
                <button
                    className="mt-4 ml-2 px-4 py-2 bg-gray-400 text-white rounded"
                    onClick={() => setPageToken(undefined)}
                >
                    Перша сторінка
                </button>
            )}
            {isLoading && <p>Завантаження...</p>}
            {error && <p></p>}
            <StudiesList studies={data?.studies || []} />

        </>
    )
}