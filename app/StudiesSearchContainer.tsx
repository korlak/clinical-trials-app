'use client'
import { useState, useEffect } from 'react'
import { useSearchStudiesQuery } from '../redux/studiesApi'
import StudiesList from './StudiesList'

export default function StudiesSearchContainer() {
    const [filters, setFilters] = useState({ nctId: '', briefTitle: '', condition: '' })
    const [pageToken, setPageToken] = useState<string | undefined>(undefined)
    const [totalCount, setTotalCount] = useState<string | undefined>(undefined)
    const [allStudies, setAllStudies] = useState<any[]>([])

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
        if (data?.studies) {
            setAllStudies(prev => {
                const existingIds = new Set(prev.map(s => s.protocolSection?.identificationModule?.nctId))
                const newUniqueStudies = data.studies.filter((study: any) => {
                    const id = study.protocolSection?.identificationModule?.nctId;
                    return !existingIds.has(id);
                });
                return pageToken ? [...prev, ...newUniqueStudies] : [...newUniqueStudies]
            })
        }
    }, [data?.studies, pageToken])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        setFilters({
            nctId: formData.get('nctId') as string,
            briefTitle: formData.get('briefTitle') as string,
            condition: formData.get('condition') as string,
        })
        setPageToken(undefined)
        setAllStudies([])
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="mb-4 flex flex-wrap gap-2 items-center justify-center border rounded p-2 w-fit"
            >
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-1 text-xl text-gray-600'>
                        Condiotion
                    </div>
                    <input
                        placeholder='e.g. Respiratory Diseases'
                        type="text"
                        name="condition"
                        defaultValue={filters.condition}
                        className="w-full h-10 text-[16px] placeholder:text-[16px] px-4 py-2.5 border border-[#515151] rounded-[10px] focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-800 text-white rounded"
                    >
                        Search
                    </button>
                    {!isLoading && <p>Results: {totalCount}</p>}
                </div>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error loading studies.</p>}
            </form>

            <StudiesList studies={allStudies} />

            {nextPageToken && (
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setPageToken(nextPageToken)}
                >
                    Load More
                </button>
            )}
        </>
    )
}
