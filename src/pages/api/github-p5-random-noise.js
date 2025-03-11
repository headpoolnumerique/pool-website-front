// pages/api/githubRepos.js
export default async function handler(req, res) {
  const { NEXT_PUBLIC_GITHUB_ACCESS_TOKEN } = process.env;

  if (!NEXT_PUBLIC_GITHUB_ACCESS_TOKEN) {
    return res.status(500).json({ message: 'Access token is missing' });
  }

  const keyword = "head-transversal-class-random-noise-2025";
  
  // GitHub API URL with the filter for public repositories with the specific topic
  const githubApiUrl = `https://api.github.com/search/repositories?q=topic:${keyword}+is:public`;

  try {
    const response = await fetch(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();

    // If no matching repositories, return a message
    if (data.items && data.items.length === 0) {
      return res.status(200).json({ message: "No public repositories found with the specified topic." });
    }

    res.status(200).json(data.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
