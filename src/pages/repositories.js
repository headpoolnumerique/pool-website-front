import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Header from "./navig_components/Header"
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github.css';

export default function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readmes, setReadmes] = useState({});

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('/api/github');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
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
        const response = await fetch(`https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/README.md`);
        const readme = response.ok ? await response.text() : 'README not available';
        setReadmes((prev) => ({ ...prev, [repo.id]: readme }));
      } catch {
        setReadmes((prev) => ({ ...prev, [repo.id]: 'Error fetching README' }));
      }
    };

    repositories.forEach((repo) => fetchReadme(repo));
  }, [repositories]);

  if (loading) return <p>Loading repositories...</p>;
  if (error) return <p>Error: {error}</p>;
  if (repositories.length === 0) return <p>No repositories found with topics.</p>;

  return (
    <div>
      <Header />
      <h1>Repositories with Topics</h1>
      <ul>
        {repositories.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <div>
              <h3>README:</h3>
              {/* Render Markdown with syntax highlighting */}
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {readmes[repo.id]}
              </ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
