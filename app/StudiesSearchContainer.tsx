'use client'
import { useState, useEffect } from 'react'
import { useSearchStudiesQuery } from '../redux/studiesApi'
import StudiesList from './StudiesList'

export default function StudiesSearchContainer() {
    const [filters, setFilters] = useState({ nctId: '', briefTitle: '', condition: '' })
    const [pageToken, setPageToken] = useState<string | undefined>(undefined)
    const [totalCount, setTotalCount] = useState<string | undefined>(undefined)
    const [allStudies, setAllStudies] = useState<any[]>([])
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    const { data, isLoading, error } = useSearchStudiesQuery({
        nctId: filters.nctId || undefined,
        briefTitle: filters.briefTitle || undefined,
        condition: filters.condition || undefined,
        pageToken
    })

    const nextPageToken = data?.nextPageToken

    useEffect(() => {
        if (typeof data?.totalCount === 'number') {
            setTotalCount(data.totalCount)
        }
    }, [data?.totalCount])

useEffect(() => {
    if (!data?.studies) {
        if (!pageToken) {
            setAllStudies([])
        }
        return
    }

    if (!pageToken) {
            setAllStudies(data.studies)
    } else {
        setAllStudies(prev => {
            const existingIds = new Set(prev.map(s => s.protocolSection?.identificationModule?.nctId))
            const newUniqueStudies = data.studies.filter((study: any) => {
                const id = study.protocolSection?.identificationModule?.nctId
                return !existingIds.has(id)
            })
            return [...prev, ...newUniqueStudies]
        })
    }
}, [data?.studies, pageToken])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (!data?.studies) setAllStudies([])
        setPageToken(undefined)
        setFilters({
            nctId: formData.get('nctId') as string,
            briefTitle: formData.get('briefTitle') as string,
            condition: formData.get('condition') as string,
        })
    }

    return (
        <div className="flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md mb-6 p-4 border rounded-lg bg-white shadow-md"
            >
                <div className="flex flex-col gap-4">
                    <label className="text-lg text-gray-700 font-semibold">
                        Condition
                    </label>
                    <input
                        placeholder="e.g. Respiratory Diseases"
                        type="text"
                        name="condition"
                        defaultValue={filters.condition}
                        className="h-10 text-base placeholder:text-base px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />

                    <button
                        type="button"
                        onClick={() => setShowAdvancedFilters(prev => !prev)}
                        className="text-sm text-cyan-800 self-start hover:text-cyan-600 border rounded-lg p-2"
                    >
                        {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                    </button>

                    {showAdvancedFilters && (
                        <div className="flex flex-col gap-4 mt-2">
                            <div>
                                <label className="text-sm text-gray-600">NCT ID</label>
                                <input
                                    type="text"
                                    name="nctId"
                                    defaultValue={filters.nctId}
                                    className="w-full h-10 px-4 py-2 border border-gray-400 rounded focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Title</label>
                                <input
                                    type="text"
                                    name="briefTitle"
                                    defaultValue={filters.briefTitle}
                                    className="w-full h-10 px-4 py-2 border border-gray-400 rounded focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700 transition"
                    >
                        Search
                    </button>

                    {!isLoading && <p className="text-center text-sm text-gray-500">Results: {totalCount}</p>}
                    {isLoading && <p className="text-center text-sm text-blue-500">Loading...</p>}
                    {error && <p className="text-center text-sm text-red-500">Error loading studies.</p>}
                </div>
            </form>

            <div className="w-full flex justify-center">
                <StudiesList studies={allStudies} />
            </div>

            {nextPageToken && (
                <button
                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 transition"
                    onClick={() => setPageToken(nextPageToken)}
                >
                    Load More
                </button>
            )}
        </div>
    )
}
