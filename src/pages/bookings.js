import { PortableText } from "@portabletext/react";
import { useState } from "react";
import Header from "./navig_components/Header";
import client from "../../sanity";

export default function BookingsView({ bookings, iframeLinks }) {
  // Function to generate random positions for floating iframes
  const randomPosition = () => ({
    position: "absolute",
    top: `${Math.random() * 80}vh`,
    left: `${Math.random() * 80}vw`,
    zIndex: -1,
  });

  return (
    <div>
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
    const bookings = await client.fetch(`
      *[_type == "bookings"]{
        title,
        booking_page,
        website,
        bio,
        expertise,
        availabilities
      }
    `);

    const iframeLinks = await client.fetch(`
      *[_type == "iframelinks"]{
        _id,
        links[]{ url }
      }
    `);

    return {
      props: {
        bookings: bookings || [],
        iframeLinks: iframeLinks || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      props: {
        bookings: [],
        iframeLinks: [],
      },
    };
  }
}
