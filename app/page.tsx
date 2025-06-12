import Link from 'next/link'
import StudiesSearchContainer from './StudiesSearchContainer'

export default function HomePage() {
  return (
    <>
      <div className='bg-cyan-400 p-3'>
        <Link href="/" className='text-xl'>MainPage</Link>
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Пошук досліджень</h1>
        <StudiesSearchContainer />
      </div>
    </>
  )
}