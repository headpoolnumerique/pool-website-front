export default async function handler(req, res) {
  const { NEXT_PUBLIC_GITHUB_ACCESS_TOKEN } = process.env;
  const repoName = "head-transversal-class-random-noise-2025";

  if (!NEXT_PUBLIC_GITHUB_ACCESS_TOKEN) {
    return res.status(500).json({ message: "Access token is missing" });
  }

  // GitHub search API to find repositories with the exact name
  const githubApiUrl = `https://api.github.com/search/repositories?q=${repoName}+in:name`;

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
    if (!data.items || data.items.length === 0) {
      return res.status(200).json({ message: "No repositories found with the specified name." });
    }

    // Fetch `sketch.js` from each repository
    const sketches = await Promise.all(
      data.items.map(async (repo) => {
        const owner = repo.owner.login;
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo.name}/main/sketch.js`;

        try {
          const sketchResponse = await fetch(rawUrl);
          if (!sketchResponse.ok) throw new Error(`sketch.js not found in ${repo.name}`);

          const code = await sketchResponse.text();
          return { repoName: repo.name, owner, sketchCode: code };
        } catch (error) {
          console.warn(error.message);
          return null;
        }
      })
    );

    // Remove failed fetches (null entries) and return the results
    res.status(200).json(sketches.filter(Boolean));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
