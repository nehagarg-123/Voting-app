import React from 'react'

export default function CandidateCard({ candidate, onVote, disabled }){
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-3">
      <img src={candidate.image || 'https://via.placeholder.com/120'} alt={candidate.name} className="w-28 h-28 rounded-full object-cover" />
      <h3 className="font-semibold">{candidate.name}</h3>
      <p className="text-sm text-gray-500">{candidate.party || ''}</p>
      <div className="text-lg font-bold">{candidate.votes ?? 0} votes</div>
      <button onClick={() => onVote(candidate._id)} disabled={disabled} className="mt-2 px-4 py-2 rounded bg-green-500 text-white disabled:opacity-60">
        Vote
      </button>
    </div>
  )
}
