import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import Header from "./navig_components/Header";
import client from "../../sanity";
import Seo from "../components/Seo";

export default function BookingsView({ bookings: staticBookings }) {
  const [bookings, setBookings] = useState(staticBookings);

  useEffect(() => {
    client.fetch(`*[_type == "bookings"]{
      title,
      booking_page,
      website,
      bio,
      expertise,
      availabilities
    }`).then((data) => {
      if (data) setBookings(data);
    });
  }, []);

  return (
    <div>
      <Seo
        title="Bookings"
        description="Book a session with Head Digital Pool staff"
        url="https://head-digital-pool.ch/bookings"
      />
      <Header />
      <main className="main-container">
        {bookings.length > 0 ? (
          <div className="bookings-main">
            {bookings.map((staff, index) => (
              <div key={index} className="booking-card">
                <div className="booking-header">
                  <h1>{staff.title || "Unnamed Staff"}</h1>
                </div>
                <div className="booking-links">
                  {staff.booking_page && (
                    <a
                      href={staff.booking_page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="booking-link"
                    >
                      Booking Page
                    </a>
                  )}
                </div>
                {staff.bio && (
                  <div className="booking-bio">
                    <PortableText value={staff.bio} />
                  </div>
                )}
                {staff.website && (
                  <span>
                    Website:{" "}
                    <a
                      href={staff.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="booking-link"
                    >
                      {staff.website}
                    </a>
                  </span>
                )}
                {staff.expertise?.length > 0 && (
                  <div className="booking-section">
                    <h3>Expertise:</h3>
                    <ul>
                      {staff.expertise.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {staff.availabilities?.length > 0 && (
                  <div className="booking-section">
                    <h3>Availabilities:</h3>
                    <ul>
                      {staff.availabilities.map((slot, idx) => (
                        <li key={idx}>{slot}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No staff bookings found.</p>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const bookings = await client.fetch(`*[_type == "bookings"]{
      title,
      booking_page,
      website,
      bio,
      expertise,
      availabilities
    }`);
    return {
      props: {
        bookings: bookings || [],
      },
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      props: { bookings: [] },
    };
  }
}