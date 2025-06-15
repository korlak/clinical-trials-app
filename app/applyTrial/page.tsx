import TrialForm from './TrialForm'

export default async function FormPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams
  const nctId = typeof params.nctId === 'string' ? params.nctId : undefined

  let exists = false
  if (nctId) {
    const res = await fetch(`https://clinicaltrials.gov/api/v2/studies/${nctId}`)
    exists = res.ok
  }

  if (!nctId || !exists) {
    return <div className="text-red-600 text-center mt-10">No study with this NCT ID found</div>
  }

  return <TrialForm nctId={nctId} />
}