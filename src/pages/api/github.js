export default async function handler(req, res) {
    const { NEXT_PUBLIC_GITHUB_ACCESS_TOKEN } = process.env;


  if (!NEXT_PUBLIC_GITHUB_ACCESS_TOKEN) {
    return res.status(500).json({ message: 'Access token is missing' });
  }
  
    // Example: Fetch organization repositories
    try {
      const response = await fetch('https://api.github.com/orgs/headpoolnumerique/repos', {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
  
      const data = await response.json();

      const filteredData = data.filter((ele) => ele.topics.includes("digitalpoolhead"));
      res.status(200).json(filteredData);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }