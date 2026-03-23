import { useState } from "react";
import { PortableText } from "@portabletext/react";
import client from "../../sanity";

import Header from "./navig_components/Header";
import ImgSliderWrapper from "./other_components/ImgSliderWrapper";

export default function EventsPage({ events, iframeLinks }) {
  const [filter, setFilter] = useState("all");
  const [openDropdowns, setOpenDropdowns] = useState({}); // track open state per event

  // Add event status (upcoming / ongoing / past)
  const eventsWithStatus = events.map((event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    let status = "past";
    if (start > now) status = "upcoming";
    else if (start <= now && end >= now) status = "ongoing";

    return { ...event, status };
  });

  const filteredEvents =
    filter === "all"
      ? eventsWithStatus
      : eventsWithStatus.filter((event) => event.status === filter);

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <Header />

      <main className="main-container">
        <header>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </header>

        <div>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => {
              const isOpen = openDropdowns[index] || false;

              return (
                <div key={index} className="event-item">

                  {/* Image slider */}
                  {Array.isArray(event.images) && event.images.length > 0 && (
                    <ImgSliderWrapper
                      title={event.title}
                      images={event.images.map((img) => ({
                        url: img.imageUrl,
                        credits: img.credits,
                      }))}
                    />
                  )}

                  <div className="cours-passeport-text">
                    <h1>{event.title || "Untitled Event"}</h1>

                    <span>Start Date: {formatDate(event.startDate)}</span>
                    <span>End Date: {formatDate(event.endDate)}</span>
                    <span>Status: {event.status}</span>

                    {/* ---- DROPDOWN ---- */}
                    <div className={`event-dropdown ${isOpen ? "open" : ""}`}>
                      <button onClick={() => toggleDropdown(index)}>
                        {isOpen ? "Close event details" : "Read more about this event"}
                      </button>

                      {isOpen && (
                        <div className="event-dropdown-content">

                          {/* Content */}
                          {event.content && (
                            <div className="event-content">
                              <PortableText value={event.content} />
                            </div>
                          )}

                          {/* Topics */}
                          {event.topics?.length > 0 && (
                            <p>
                              <strong>Topics:</strong> {event.topics.join(", ")}
                            </p>
                          )}

                          {/* Collaboration */}
                          {event.collaboration && (
                            <p>
                              <strong>Collaboration:</strong> {event.collaboration}
                            </p>
                          )}

                        </div>
                      )}
                    </div>
                    {/* ---- END DROPDOWN ---- */}

                    {/* External Link always after dropdown */}
                    {event.externalLink && (
                      <p>
                        <a
                          href={event.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          External Link
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const events = await client.fetch(`*[_type == "event"]{
      title,
      startDate,
      endDate,
      content,
      topics,
      collaboration,
      externalLink,
      images[]{
        "imageUrl": image.asset->url,
        credits
      }
    }`);

    const iframeLinks = await client.fetch(`*[_type == "iframelinks"]{
      _id,
      links[]{ url }
    }`);

    return {
      props: {
        events: events || [],
        iframeLinks: iframeLinks || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return {
      props: {
        events: [],
        iframeLinks: [],
      },
    };
  }
}
