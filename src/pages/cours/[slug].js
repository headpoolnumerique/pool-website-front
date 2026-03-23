import { useEffect, useState } from "react";
import Header from "../navig_components/Header";
import client from "../../../sanity";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Seo from "../../components/Seo";

export default function CourseDetails({ course: staticCourse }) {
  const [course, setCourse] = useState(staticCourse);
  const [repository, setRepository] = useState(null);
  const [loadingRepo, setLoadingRepo] = useState(true);
  const [readme, setReadme] = useState(null);

  // Fetch fresh course data client-side
  useEffect(() => {
    if (!staticCourse?.slug) return;
    client.fetch(
      `*[_type == "cours" && slug.current == $slug][0]{
        title,
        content,
        status,
        topics,
        githubKeyword
      }`,
      { slug: staticCourse.slug }
    ).then((data) => {
      if (data) setCourse(data);
    });
  }, [staticCourse]);

  // Fetch GitHub repo
  useEffect(() => {
    const fetchRepository = async () => {
      if (!course?.githubKeyword) {
        setLoadingRepo(false);
        return;
      }
      try {
        const response = await fetch(`/api/github-pool-repo`);
        if (!response.ok) throw new Error("Failed to fetch GitHub repositories");
        const data = await response.json();
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
      <Seo
        title={course.title}
        description={`Topics and details for ${course.title}`}
        url={`https://head-digital-pool.ch/cours/${staticCourse?.slug}`}
      />
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

export async function getStaticPaths() {
  const query = `*[_type == "cours"]{ slug }`;
  const cours = await client.fetch(query);
  const paths = cours.map((cour) => ({
    params: { slug: cour.slug.current },
  }));
  return {
    paths,
    fallback: false, // ← changed from true (required for output: export)
  };
}

export async function getStaticProps({ params }) {
  const courseQuery = `*[_type == "cours" && slug.current == $slug][0]{
    title,
    content,
    status,
    topics,
    githubKeyword,
    "slug": slug.current
  }`;
  const course = await client.fetch(courseQuery, { slug: params.slug });
  return {
    props: {
      course: course || null,
    },
  };
}