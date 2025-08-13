import React, { useEffect, useState, useRef } from 'react'
import { fetchCandidates, voteCandidate, fetchElection } from '../services/api'
import { socket } from '../services/socket'

function formatTimeLeft(ms) {
  if (ms <= 0) return '0s'
  const totalSeconds = Math.floor(ms / 1000)
  const d = Math.floor(totalSeconds / (3600 * 24))
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  let parts = []
  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

export default function Voting() {
  const [candidates, setCandidates] = useState([])
  const [election, setElection] = useState(null)
  const [timeLeftText, setTimeLeftText] = useState('')
  const intervalRef = useRef(null)
  const [loadingVoteId, setLoadingVoteId] = useState(null)
  const [votedCandidateId, setVotedCandidateId] = useState(null) // NEW

  const loadCandidates = async () => {
    try {
      const res = await fetchCandidates()
      setCandidates(res.data.candidates || res.data || [])
      setVotedCandidateId(res.data.votedCandidateId || null) // fetch which candidate you voted
    } catch (err) {
      console.error('Load candidates', err)
    }
  }

  const loadElection = async () => {
    try {
      const r = await fetchElection()
      setElection(r.data)
    } catch (err) {
      console.warn('No election info', err)
    }
  }

  useEffect(() => {
    loadCandidates()
    loadElection()

    socket.on('voteUpdated', (updatedCandidates) => {
      if (Array.isArray(updatedCandidates)) {
        setCandidates(updatedCandidates)
      } else if (updatedCandidates && updatedCandidates.candidateId) {
        setCandidates(prev =>
          prev.map(c =>
            c._id === updatedCandidates.candidateId
              ? { ...c, voteCount: updatedCandidates.voteCount ?? c.voteCount }
              : c
          )
        )
      }
    })

    socket.on('electionStatusUpdated', payload => {
      setElection(prev => ({ ...(prev || {}), status: payload.status }))
    })

    return () => {
      socket.off('voteUpdated')
      socket.off('electionStatusUpdated')
    }
  }, [])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const updateTime = () => {
      if (!election) { setTimeLeftText(''); return }
      const now = new Date()
      const start = election.startDate ? new Date(election.startDate) : null
      const end = election.endDate ? new Date(election.endDate) : null

      if (election.status === 'upcoming' && start) {
        setTimeLeftText(`Voting starts in: ${formatTimeLeft(start - now)}`)
      } else if (election.status === 'live' && end) {
        setTimeLeftText(`Voting ends in: ${formatTimeLeft(end - now)}`)
      } else {
        setTimeLeftText('')
      }
    }

    updateTime()
    intervalRef.current = setInterval(updateTime, 1000)
    return () => clearInterval(intervalRef.current)
  }, [election])

  const onVote = async (id) => {
    try {
      setLoadingVoteId(id)
      await voteCandidate(id)
      setVotedCandidateId(id) // store the candidate you voted for
      setLoadingVoteId(null)
    } catch (err) {
      setLoadingVoteId(null)
      console.error('Vote failed', err)
      loadCandidates()
      alert(err?.response?.data?.message || 'Vote failed')
    }
  }

  return (
    <div className="relative w-screen min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-200 to-blue-500"></div>
      <div className="relative pt-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-white">Vote</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <div
              key={c._id}
              className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col items-center gap-3 text-gray-900
              ${votedCandidateId === c._id ? 'border-4 border-green-500' : ''}`}
            >
              <img
                src={c.photo || c.image || "/default.png"}
                alt={c.name}
                className="w-30 h-30 rounded-full object-cover border-4 border-purple-300 shadow"
              />
              <h3 className="font-semibold text-lg mt-2">{c.name}</h3>
              <p className="text-sm text-gray-600">{c.party || ""}</p>

              {votedCandidateId === c._id && (
                <p className="text-green-600 font-bold">✅ You voted for this candidate</p>
              )}

              {votedCandidateId ? (
                votedCandidateId !== c._id && <p className="text-gray-500">Voting disabled</p>
              ) : (
                <button
                  onClick={() => onVote(c._id)}
                  className="mt-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-60"
                  disabled={loadingVoteId === c._id}
                >
                  {loadingVoteId === c._id ? "Voting..." : "Vote"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
