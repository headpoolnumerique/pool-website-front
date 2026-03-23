import { useState, useEffect } from "react";
import { PortableText } from "@portabletext/react";
import client from "../../sanity";
import Header from "./navig_components/Header";
import ImgSliderWrapper from "./other_components/ImgSliderWrapper";
import Seo from "../components/Seo";

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-GB");
};

const addStatus = (items) =>
  items.map((item) => {
    const now = new Date();
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    let status = "past";
    if (start > now) status = "upcoming";
    else if (start <= now && end >= now) status = "ongoing";
    return { ...item, status };
  });

export default function EventsPage({ events: staticEvents }) {
  const [filter, setFilter] = useState("all");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [events, setEvents] = useState(staticEvents);

  useEffect(() => {
    client.fetch(`*[_type == "event"]{
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
    }`).then((data) => {
      if (data) setEvents(data);
    });
  }, []);

  const eventsWithStatus = addStatus(events);
  const filteredEvents =
    filter === "all"
      ? eventsWithStatus
      : eventsWithStatus.filter((event) => event.status === filter);

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div>
      <Seo
        title="Events"
        description="Upcoming and past events at Head Digital Pool"
        url="https://head-digital-pool.ch/events"
      />
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
                    <div className={`event-dropdown ${isOpen ? "open" : ""}`}>
                      <button onClick={() => toggleDropdown(index)}>
                        {isOpen ? "Close event details" : "Read more about this event"}
                      </button>
                      {isOpen && (
                        <div className="event-dropdown-content">
                          {event.content && (
                            <div className="event-content">
                              <PortableText value={event.content} />
                            </div>
                          )}
                          {event.topics?.length > 0 && (
                            <p>
                              <strong>Topics:</strong> {event.topics.join(", ")}
                            </p>
                          )}
                          {event.collaboration && (
                            <p>
                              <strong>Collaboration:</strong> {event.collaboration}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
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
    return {
      props: {
        events: events || [],
      },
    };
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return {
      props: { events: [] },
    };
  }
}