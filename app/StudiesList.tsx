import Link from "next/link";

export default function StudiesList({ studies }: { studies: any[] }) {
  if (!studies.length) return <p className="mt-4 text-gray-500">Нічого не знайдено</p>;
  
  return (
    <div className="space-y-6">
      {studies.map((study: any) => {
        const id = study.protocolSection?.identificationModule?.nctId;
        const title = study.protocolSection?.identificationModule?.briefTitle;
        const conditions = study.protocolSection?.conditionsModule?.conditions;
        
        return (
          <div 
            className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            key={id}
          >
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">
                {title}
              </h1>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center text-gray-600 text-sm gap-2">
                <div className="font-mono">Code: {id}</div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Conditions</h2>
              {Array.isArray(conditions) && conditions.length > 0 ? (
                <ul className="space-y-2">
                  {conditions.map((cond: string, idx: number) => (
                    <li 
                      key={idx} 
                      className="flex items-start text-gray-900"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2"></span>
                      {cond}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500">Немає даних</span>
              )}
            </div>

            <Link href={`/applyTrial?nctId=${id}`}>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                <span className="font-bold text-green-700">Apply To Trial</span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}