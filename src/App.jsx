import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'

function App() {

  const matches = [
    {
      team1: 'RCB',
      team2: 'CSK',
      date: '25 March 2026',
      venue: 'Bengaluru'
    },
    {
      team1: 'MI',
      team2: 'KKR',
      date: '27 March 2026',
      venue: 'Mumbai'
    },
    {
      team1: 'RCB',
      team2: 'MI',
      date: '29 March 2026',
      venue: 'Bengaluru'
    }
  ]

  return (
    <div>
      <Navbar />

      <Hero />

      <h2>Upcoming IPL Matches</h2>

      {matches.map((match, index) => (
        <MatchCard
          key={index}
          team1={match.team1}
          team2={match.team2}
          date={match.date}
          venue={match.venue}
        />
      ))}
    </div>
  )
}

export default App