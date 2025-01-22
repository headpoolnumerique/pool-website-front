import { useState } from "react";
import { PortableText } from "@portabletext/react";
import client from "../../sanity";
import Header from "./navig_components/Header"

export default function CoursPasseportPage({ coursPasseports }) {
  const [filter, setFilter] = useState("all"); // State to manage the filter

  const coursPasseportsWithStatus = coursPasseports.map((passeport) => {
    const currentDate = new Date();
    const startDate = new Date(passeport.startDate);
    const endDate = new Date(passeport.endDate);

    let status = "past";
    if (startDate > currentDate) {
      status = "upcoming";
    } else if (startDate <= currentDate && endDate >= currentDate) {
      status = "ongoing";
    }

    return { ...passeport, status };
  });

  // Filter the coursPasseports based on the selected filter
  const filteredPasseports =
    filter === "all"
      ? coursPasseportsWithStatus
      : coursPasseportsWithStatus.filter((passeport) => passeport.status === filter);

  return (
    <div>
      <Header />
      <header>
        <h1>Cours Passeport</h1>
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

      {/* Map over the filtered array and render each coursPasseport */}
      {filteredPasseports.map((coursPasseport, index) => (
        <div key={index} className="cours-passeport">
          <h2>{coursPasseport.title || "Untitled"}</h2>
          <span>
            Start Date: {new Date(coursPasseport.startDate).toLocaleDateString()}
          </span>
          <span>
            End Date: {new Date(coursPasseport.endDate).toLocaleDateString()}
          </span>
          <span>Status: {coursPasseport.status || "Unknown"}</span>
          {/* Render block content */}
          <div>
            <PortableText value={coursPasseport.content || []} />
          </div>

          {/* Render topics */}
          {coursPasseport.topics && (
            <div>
              <h3>Topics:</h3>
              <ul>
                {coursPasseport.topics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const coursPasseports = await client.fetch(`*[_type == "coursPasseport"]{
      title,
      content,
      topics,
      startDate,
      endDate
    }`);

    return {
      props: {
        coursPasseports: coursPasseports || [], // Fallback to empty array
      },
      revalidate: 60, // Enable ISR
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      props: {
        coursPasseports: [],
      },
    };
  }
}
