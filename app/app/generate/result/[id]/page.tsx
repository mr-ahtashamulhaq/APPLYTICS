export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Generated Resume</h1>
      <p className="text-gray-500 mt-2">Resume ID: {params.id}</p>
      {/* Phase 7: Match score, keyword chips, PDF preview, download button */}
    </div>
  )
}
