import { useState } from "react";
import Link from "next/link";
import client from "../../../sanity";
import Header from "../navig_components/Header";
import P5View from '../p5_canvas/P5View'; 

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
    <div className="courses-container">
      <Header />
      <P5View />
      <main className="main-container">
      <section className="courses-header">

        {/* Dropdown for filtering courses */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="courses-filter"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </section>

      <div className="courses-list">
        {/* Display filtered courses */}
        {filteredCourses.length > 0 ? (
          filteredCourses.map((cour) => (
            <div key={cour.slug.current} className="course-card">
              <h2><span>{cour.title}</span></h2>
              <p>Start Date: {new Date(cour.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(cour.endDate).toLocaleDateString()}</p>
              <p>Status: {cour.status}</p>
              <p>Topics: {cour.topics?.join(", ")}</p>
              <Link href={`/cours/${cour.slug.current}`} className="course-link">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>No courses found for the selected filter.</p>
        )}
      </div>
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
