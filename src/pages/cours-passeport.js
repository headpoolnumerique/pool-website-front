import { useState } from "react";
import { PortableText } from "@portabletext/react";
import client from "../../sanity";
import Header from "./navig_components/Header";
import ImgSliderWrapper from "./other_components/ImgSliderWrapper";

export default function CoursPasseportPage({ coursPasseports, iframeLinks }) {
  const [filter, setFilter] = useState("all");

  const coursPasseportsWithStatus = coursPasseports.map((passeport) => {
    const now = new Date();
    const start = new Date(passeport.startDate);
    const end = new Date(passeport.endDate);

    let status = "past";
    if (start > now) status = "upcoming";
    else if (start <= now && end >= now) status = "ongoing";

    return { ...passeport, status };
  });

  const filteredPasseports =
    filter === "all"
      ? coursPasseportsWithStatus
      : coursPasseportsWithStatus.filter((p) => p.status === filter);

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div>
      <Header />

      <main className="main-container-cours-pass">

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

        <div className="cours-passeport-main">
          {filteredPasseports.length > 0 ? (
            filteredPasseports.map((passeport, index) => (
              <div key={index} className="cours-passeport">
                <div className="cours-passeport-wrapper">

                  {Array.isArray(passeport.images) && passeport.images.length > 0 && (
                    <ImgSliderWrapper images={passeport.images} title={passeport.title} />
                  )}

                  <div className="cours-passeport-text">
                    <h1>{passeport.title || "Untitled"}</h1>

                    <span>Start Date: {formatDate(passeport.startDate)}</span>
                    <span>End Date: {formatDate(passeport.endDate)}</span>
                    <span>Status: {passeport.status}</span>

                    <div>
                      <PortableText value={passeport.content || []} />
                    </div>

                    {passeport.topics && (
                      <div>
                        <h3>Covered topics:</h3>
                        <ul>
                          {passeport.topics.map((topic, idx) => (
                            <li key={idx}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No cours passeports found.</p>
          )}
        </div>
      </main>
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
      endDate,
      "images": images[].image.asset->url
    }`);

    const iframeLinks = await client.fetch(`*[_type == "iframelinks"]{
      _id,
      links[]{ url }
    }`);

    return {
      props: {
        coursPasseports: coursPasseports || [],
        iframeLinks: iframeLinks || []
      },
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      props: {
        coursPasseports: [],
        iframeLinks: []
      },
    };
  }
}
