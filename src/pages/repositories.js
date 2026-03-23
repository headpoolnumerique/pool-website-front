import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Header from "./navig_components/Header";
import rehypeHighlight from "rehype-highlight";
import P5Canvas from './p5_canvas/P5Canvas';
import P5View from './p5_canvas/P5View';
import "highlight.js/styles/github.css";
import client from "../../sanity";

export default function Repositories({ iframeLinks }) {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readmes, setReadmes] = useState({});
  const [openRepo, setOpenRepo] = useState(null);
  const [showP5, setShowP5] = useState(true); // <-- slider state

  const toggleRepo = (id) => {
    setOpenRepo((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch("/api/github-pool-repo");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setRepositories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    const fetchReadme = async (repo) => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/README.md`
        );
        const readme = response.ok
          ? await response.text()
          : "README not available";
        setReadmes((prev) => ({ ...prev, [repo.id]: readme }));
      } catch {
        setReadmes((prev) => ({
          ...prev,
          [repo.id]: "Error fetching README",
        }));
      }
    };

    repositories.forEach((repo) => fetchReadme(repo));
  }, [repositories]);

  return (
    <div>
      <Header />

      <main className="main-container">
        <h1>{loading ? "Loading Repositories..." : "Repositories with Topics"}</h1>

        {error && <p className="error_message">Error: {error}</p>}
        {!loading && !error && repositories.length === 0 && (
          <p>No repositories found with topics.</p>
        )}

        <ul className="repo-list">
          {!loading &&
            !error &&
            repositories.map((repo) => (
              <li key={repo.id} className="repo-card">
                <div
                  className="repo-title"
                  onClick={() => toggleRepo(repo.id)}
                >
                  {repo.name}
                </div>

                {openRepo === repo.id && (
                  <div className="repo-readme">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {readmes[repo.id]}
                    </ReactMarkdown>
                  </div>
                )}
              </li>
            ))}
        </ul>
      </main>

    </div>
  );
}

export async function getStaticProps() {
  try {
    const iframeLinks = await client.fetch(`*[_type == "iframelinks"]{
      _id,
      links[]{ url }
    }`);

    return {
      props: {
        iframeLinks: iframeLinks || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch iframe links:", error);
    return {
      props: { iframeLinks: [] },
    };
  }
}
