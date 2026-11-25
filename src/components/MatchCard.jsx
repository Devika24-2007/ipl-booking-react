import { supabase } from '../supabase'

function MatchCard(props) {
  const bookTickets = async () => {
    const userName = prompt('Enter your name')

    if (!userName || !userName.trim()) return

    const tickets = Number(prompt('Enter number of tickets'))

    if (!Number.isInteger(tickets) || tickets < 1) {
      alert('Enter a valid number of tickets')
      return
    }

    if (tickets > props.available_seats) {
      alert('Not enough seats available')
      return
    }

    const totalPrice = tickets * props.price

    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        match_id: props.id,
        user_name: userName.trim(),
        match_title: `${props.team1} vs ${props.team2}`,
        tickets: tickets,
        total_price: totalPrice
      }])

    if (bookingError) {
      alert(bookingError.message)
      return
    }

    const newSeats = props.available_seats - tickets

    const { error: updateError } = await supabase
      .from('matches')
      .update({ available_seats: newSeats })
      .eq('id', props.id)

    if (updateError) {
      alert('Booking saved, but seat update failed: ' + updateError.message)
      return
    }

    props.onSeatsUpdated(props.id, newSeats)

    alert('Tickets booked successfully!')
  }

  return (
    <div className="match-card">
      <h2>{props.team1} vs {props.team2}</h2>

      <p>Date: {props.date}</p>
      <p>Venue: {props.venue}</p>
      <p>Ticket Price: ₹{props.price}</p>

      <p>
        Available Seats: {props.available_seats}
      </p>

      <button
        onClick={bookTickets}
        disabled={props.available_seats <= 0}
      >
        {props.available_seats <= 0 ? 'Sold Out' : 'Book Tickets'}
      </button>
    </div>
  )
}

export default MatchCard