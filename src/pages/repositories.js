import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Header from "./navig_components/Header";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Seo from "../components/Seo";

export default function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readmes, setReadmes] = useState({});
  const [openRepo, setOpenRepo] = useState(null);

  const toggleRepo = (id) => {
    setOpenRepo((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        // Local: uses /api/github-pool-repo | Production: uses the PHP proxy
        const apiUrl = process.env.NEXT_PUBLIC_GITHUB_PROXY_URL || "/api/github-pool-repo";
        const response = await fetch(apiUrl);
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
        const readme = response.ok ? await response.text() : "README not available";
        setReadmes((prev) => ({ ...prev, [repo.id]: readme }));
      } catch {
        setReadmes((prev) => ({ ...prev, [repo.id]: "Error fetching README" }));
      }
    };
    repositories.forEach((repo) => fetchReadme(repo));
  }, [repositories]);

  return (
    <div>
      <Seo
        title="Repositories"
        description="GitHub repositories from Head Digital Pool"
        url="https://head-digital-pool.ch/repositories"
      />
      <Header />
      <main className="main-container">
        <h1>{loading ? "Loading Repositories..." : "Repositories with Topics"}</h1>
        {error && <p className="error_message">Error: {error}</p>}
        {!loading && !error && repositories.length === 0 && (
          <p>No repositories found with topics.</p>
        )}
        <ul className="repo-list">
          {!loading && !error && repositories.map((repo) => (
            <li key={repo.id} className="repo-card">
              <div className="repo-title" onClick={() => toggleRepo(repo.id)}>
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
  return { props: {} };
}