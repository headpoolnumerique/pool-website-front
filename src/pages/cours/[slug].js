import { useEffect, useState } from "react";
import client from "../../../sanity";
import { PortableText } from "@portabletext/react";
import ReactMarkdown from "react-markdown";

export default function CourseDetails({ course }) {
  const [repository, setRepository] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(true);
  const [readme, setReadme] = useState(null);


  useEffect(() => {
    // Fetch GitHub repositories if course topics are defined
    const fetchRepository = async () => {

      if (!course || !course.topics) return;
      
      try {
        const response = await fetch(`/api/github`); 
        
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub repositories");
        }
        
        const data = await response.json();
        const selectedRepo = data.find((element) => element.topics.includes("socket-io"));
        setRepository(selectedRepo);

        if (selectedRepo && selectedRepo.full_name) {
          const readmeResponse = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/readme`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
            },
          });          

          if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            const decodedReadme = atob(readmeData.content); // Decode Base64 content
            setReadme(decodedReadme);
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

  if (!course) {
    return <div>Loading course details...</div>;
  }

  return (
    <div>
      <header style={{ textAlign: "center", padding: "2rem 0", borderBottom: "1px solid"}}>
        <h1>{course.title}</h1>
      </header>

      <main style={{ padding: "2rem" }}>
        <p><strong>Status:</strong> {course.status}</p>

        {course.topics && course.topics.length > 0 && (
          <div>
            <h2>Topics Covered</h2>
            <ul>
              {course.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h2>Course's Project Repo:</h2>
          {loadingRepo && <p>Loading repositories...</p>}
          {!loadingRepo && repository && (
            <div>
              <h3>
                <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                  {repository.name}
                </a>
              </h3>
              <p>{repository.description}</p>
            </div>
          )}
          {!loadingRepo && !repository && (
            <p>No repositories found for the given topics.</p>
          )}
        </div>
        <div>
          <ReactMarkdown>{readme}</ReactMarkdown>
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
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const query = `*[_type == "cours" && slug.current == $slug][0]{
    title,
    content,
    status,
    topics,
  }`;

  const course = await client.fetch(query, { slug: params.slug });

  return {
    props: { course },
    revalidate: 60,
  };
}