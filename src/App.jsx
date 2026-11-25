import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'
import { supabase } from './supabase'

function App() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setMatches(data || [])
      }

      setLoading(false)
    }

    fetchMatches()

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setMatches((current) =>
              current.map((match) =>
                match.id === payload.new.id ? payload.new : match
              )
            )
          }

          if (payload.eventType === 'INSERT') {
            setMatches((current) => [...current, payload.new])
          }

          if (payload.eventType === 'DELETE') {
            setMatches((current) =>
              current.filter((match) => match.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div>
      <Navbar />
      <Hero />

      <h2>Upcoming IPL Matches</h2>

      {loading && <p>Loading matches...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && matches.length === 0 && (
        <p>No matches found.</p>
      )}

      <div className="matches">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            id={match.id}
            team1={match.team1}
            team2={match.team2}
            date={match.date}
            venue={match.venue}
            price={match.price}
            available_seats={match.available_seats}
            onSeatsUpdated={(matchId, newSeats) => {
              setMatches((current) =>
                current.map((item) =>
                  item.id === matchId
                    ? { ...item, available_seats: newSeats }
                    : item
                )
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default App