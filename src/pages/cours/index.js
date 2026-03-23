import { useState } from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import client from "../../../sanity";
import Header from "../navig_components/Header";
import ImgSliderWrapper from "../other_components/ImgSliderWrapper";

// Utility to format dates consistently
const formatDate = (dateString) => {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString("en-GB"); // DD/MM/YYYY
};

export default function CoursesIndex({ cours, iframeLinks }) {
  const [filter, setFilter] = useState("all");

  // Add status field client-side
  const coursWithStatus = cours.map((c) => {
    const now = new Date();
    const start = new Date(c.startDate);
    const end = new Date(c.endDate);

    let status = "past";
    if (start > now) status = "upcoming";
    else if (start <= now && end >= now) status = "ongoing";

    return { ...c, status };
  });

  const filteredCourses =
    filter === "all"
      ? coursWithStatus
      : coursWithStatus.filter((c) => c.status === filter);

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

        <div className="course-main">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((cour, index) => (
              <div key={index} className="cours-passeport">
                <div className="cours-passeport-wrapper">

                  {Array.isArray(cour.images) && cour.images.length > 0 && (
                    <ImgSliderWrapper images={cour.images} title={cour.title} />
                  )}

                  <div className="cours-passeport-text">
                    <Link href={`/cours/${cour.slug.current}`}>
                      <h1 style={{ cursor: "pointer" }}>
                        {cour.title || "Untitled"}
                      </h1>
                    </Link>

                    <span>Start Date: {formatDate(cour.startDate)}</span>
                    <span>End Date: {formatDate(cour.endDate)}</span>
                    <span>Status: {cour.status}</span>

                    {cour.content && (
                      <div>
                        <PortableText value={cour.content} />
                      </div>
                    )}

                    {cour.topics && (
                      <div>
                        <h3>Covered topics:</h3>
                        <ul>
                          {cour.topics.map((topic, idx) => (
                            <li key={idx}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      href={`/cours/${cour.slug.current}`}
                      className="course-link"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No courses found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const cours = await client.fetch(`*[_type == "cours"]{
      title,
      content,
      topics,
      slug,
      startDate,
      endDate,
      "images": images[].image.asset->url
    }`);

    // ✅ Normalize query to match your other pages
    const iframeLinks = await client.fetch(`*[_type == "iframelinks"]{
      _id,
      links[]{ url }
    }`);

    return {
      props: {
        cours: cours || [],
        iframeLinks: iframeLinks || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      props: {
        cours: [],
        iframeLinks: [],
      },
    };
  }
}
