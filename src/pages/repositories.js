import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Header from "./navig_components/Header";
import P5Canvas from './p5_canvas/P5Canvas';
import { planeSketch, drawingSketch } from "./p5_canvas/sketches";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github.css';

export default function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readmes, setReadmes] = useState({});
  const [isVisible, setIsVisible] = useState(true); // State to toggle visibility

  const toggleVisibility = () => {
    setIsVisible((prevVisibility) => !prevVisibility);
  };

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
      <Header toggleVisibility={toggleVisibility} />
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

      <P5Canvas sketch={planeSketch} width={200} height={200} left={50} top={300} isVisible={isVisible} />
      <P5Canvas sketch={drawingSketch} width={600} height={200} left={300} top={400} isVisible={isVisible} />
    </div>
  );
}
