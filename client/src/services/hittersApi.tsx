export async function fetchQualifiedHitters(season: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&sportId=1&group=hitting&season=${season}&sortBy=initLastName&order=asc&limit=1000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.stats[0].splits;
    }
  } catch (error) {
    console.error("Error fetching qualified hitters:", error);
    return null;
  }
}
