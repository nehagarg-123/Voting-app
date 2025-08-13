import React, { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [candidates, setCandidates] = useState([]);
  const API_BASE = 'http://localhost:5000'; // Change to your backend base URL

  // Sort candidates by vote count
  const sortCandidates = (list) => {
    return [...(list || [])].sort((a, b) => (b.count || 0) - (a.count || 0));
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/candidate/vote/count`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      setCandidates(sortCandidates(data));
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Optional: Refresh every 5 seconds for live updates
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-blue-400 to-yellow-400"></div>

      <div className="relative pt-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-white">Leaderboard</h2>
        <ul className="space-y-4">
          {candidates.map((c, i) => (
            <li
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold w-8 text-center">{i + 1}</div>
                <img
                  src={c.photo || c.image || '/default.png'}
                  alt={c.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-300"
                />
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.party}</div>
                </div>
              </div>
              <div className="text-lg font-bold">
                {c.count} votes
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
