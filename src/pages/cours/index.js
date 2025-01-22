import { useState } from "react";
import Link from "next/link";
import client from "../../../sanity";


export default function CoursesIndex({ cours }) {
  const [filter, setFilter] = useState("all"); // State to track selected filter

  // Calculate the status dynamically based on startDate and endDate
  const coursWithStatus = cours.map((cour) => {
    const currentDate = new Date();
    const startDate = new Date(cour.startDate);
    const endDate = new Date(cour.endDate);

    let status = "past";
    if (startDate > currentDate) {
      status = "upcoming";
    } else if (startDate <= currentDate && endDate >= currentDate) {
      status = "ongoing";
    }

    return { ...cour, status };
  });

  // Filter courses based on the selected status
  const filteredCourses =
    filter === "all"
      ? coursWithStatus
      : coursWithStatus.filter((cour) => cour.status === filter);

  return (
    <div>
      <section
        style={{
          padding: "1rem",
          backgroundColor: "#f0f0f0",
          textAlign: "center",
        }}
      >
        <h1>All Courses</h1>

        {/* Dropdown for filtering courses */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            margin: "1rem",
            padding: "0.5rem",
            fontSize: "1rem",
          }}
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </section>

      <main style={{ padding: "1rem" }}>
        {/* Display filtered courses */}
        {filteredCourses.length > 0 ? (
          filteredCourses.map((cour) => (
            <div key={cour.slug.current} style={{ marginBottom: "2rem" }}>
              <h2>{cour.title}</h2>
              <img
                src={cour.image}
                alt={cour.title}
                style={{ width: "200px", height: "auto" }}
              />
              <p>
                Start Date: {new Date(cour.startDate).toLocaleDateString()}
              </p>
              <p>End Date: {new Date(cour.endDate).toLocaleDateString()}</p>
              <p>Status: {cour.status}</p>
              <p>Topics: {cour.topics?.join(", ")}</p>
              <Link
                href={`/cours/${cour.slug.current}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>No courses found for the selected filter.</p>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const query = `*[_type == "cours"]{
    title,
    content,
    topics,
    "image": image.asset->url,
    slug,
    startDate,
    endDate
  }`;
  const cours = await client.fetch(query);

  return {
    props: {
      cours: cours || [], // Fallback to empty array
    },
    revalidate: 60, // ISR
  };
}
