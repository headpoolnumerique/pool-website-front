// pages/cours/[slug].jsx
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../navig_components/Header";
import client from "../../../sanity";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export default function CourseDetails({ course, iframeLinks }) {
  const [repository, setRepository] = useState(null);
  const [loadingRepo, setLoadingRepo] = useState(true);
  const [readme, setReadme] = useState(null);

  useEffect(() => {
    const fetchRepository = async () => {
      // If no keyword, do nothing
      if (!course?.githubKeyword) {
        setLoadingRepo(false);
        return;
      }

      try {
        const response = await fetch(`/api/github-pool-repo`);
        if (!response.ok) throw new Error("Failed to fetch GitHub repositories");

        const data = await response.json();

        // Use githubKeyword from CMS
        const selectedRepo = data.find((element) =>
          element.topics.includes(course.githubKeyword)
        );

        setRepository(selectedRepo);

        if (selectedRepo?.full_name) {
          const readmeResponse = await fetch(
            `https://raw.githubusercontent.com/${selectedRepo.owner.login}/${selectedRepo.name}/${selectedRepo.default_branch}/README.md`
          );

          if (readmeResponse.ok) {
            const readmeText = await readmeResponse.text();
            setReadme(readmeText);
          }
        }
      } catch (error) {
        console.error("Error fetching repository or README:", error);
      } finally {
        setLoadingRepo(false);
      }
    };
    fetchRepository();
  }, [course]);

  if (!course) return <div>Loading course details...</div>;

  return (
    <div>
      <Header />

      <main className="main-container">
        
        <div className="course-main">
          <header>
            <h1>{course.title}</h1>
          </header>

          <p>
            <strong>Status:</strong> {course.status}
          </p>

          {course.topics?.length > 0 && (
            <div className="course-section">
              <h2>Topics Covered</h2>
              <ul>
                {course.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Only show repo section if githubKeyword exists */}
          {course.githubKeyword && (
            <div className="course-section">
              <h2>Course&apos;s Project Repo:</h2>
              {loadingRepo && <p>Loading repository...</p>}
              {!loadingRepo && repository && (
                <div className="repo-card">
                  <h3>
                    <a
                      href={repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repository.name}
                    </a>
                  </h3>
                  <p>{repository.description}</p>
                </div>
              )}
              {!loadingRepo && !repository && (
                <p>No repository found for the given keyword.</p>
              )}
            </div>
          )}

          {readme && (
            <div className="course-section">
              <h2>README:</h2>
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {readme}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Generate static paths
export async function getStaticPaths() {
  const query = `*[_type == "cours"]{ slug }`;
  const cours = await client.fetch(query);

  const paths = cours.map((cour) => ({
    params: { slug: cour.slug.current },
  }));

  return {
    paths,
    fallback: true,
  };
}

// Fetch static props
export async function getStaticProps({ params }) {
  const courseQuery = `*[_type == "cours" && slug.current == $slug][0]{
    title,
    content,
    status,
    topics,
    githubKeyword
  }`;

  const course = await client.fetch(courseQuery, { slug: params.slug });

  // Fetch iframe links
  const iframeLinks = await client.fetch(`
    *[_type == "iframelinks"]{
      _id,
      links[]{ url }
    }
  `);

  return {
    props: {
      course,
      iframeLinks: iframeLinks || [],
    },
    revalidate: 60,
  };
}
