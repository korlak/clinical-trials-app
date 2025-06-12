import TrialForm from './TrialForm'

export default async function FormPage({ searchParams }: { searchParams: { nctId?: string } }) {
  const nctId = searchParams?.nctId

  let exists = false
  if (nctId) {
    const res = await fetch(`https://clinicaltrials.gov/api/v2/studies/${nctId}`)
    exists = res.ok
  }

  if (!nctId || !exists) {
    return <div className="text-red-600 text-center mt-10">Дослідження з таким NCT ID не знайдено</div>
  }

  return <TrialForm nctId={nctId} />
}