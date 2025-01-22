import { PortableText } from '@portabletext/react'
import client from '../../sanity'
import Header from "./navig_components/Header"

export default function Bookings({ bookings }) {

  return (
    <div style={{ padding: "2rem" }}>
      <Header />
      <h1>Bookings</h1>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id} style={{ marginBottom: "1.5rem" }}>
              <h2>{booking.title}</h2>
              {booking.bio && <PortableText value={booking.bio} />}
              {booking.booking_page && (
                <p>
                  <a href={booking.booking_page} target="_blank" rel="noopener noreferrer">
                    Booking Page
                  </a>
                </p>
              )}
              {booking.expertise && (
                <div>
                  <h3>Expertise:</h3>
                  <ul>
                    {booking.expertise.map((expertise, index) => (
                      <li key={index}>{expertise}</li>
                    ))}
                  </ul>
                </div>
              )}
              {booking.availabilities && (
                <div>
                  <h3>Availabilities:</h3>
                  <ul>
                    {booking.availabilities.map((availability, index) => (
                      <li key={index}>{availability}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  )
}

export async function getStaticProps() {
  // Fetch all bookings from Sanity
  const bookings = await client.fetch(`*[_type == "bookings"]`)
  return {
    props: {
      bookings,
    },
    revalidate: 60, // Enable ISR with a 60-second revalidation interval
  }
}