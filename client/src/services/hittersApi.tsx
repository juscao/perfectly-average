import { AwardRecipient, Hitter } from "../types/hitting.types";

export async function fetchQualifiedHitters(season: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&sportId=1&group=hitting&season=${season}&sortBy=initLastName&order=asc&limit=10000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.stats[0].splits.filter(
        (player: Hitter) => player.stat.atBats > 0
      );
    }
  } catch (error) {
    console.error("Error fetching qualified hitters:", error);
    return null;
  }
}

export async function fetchAllHitters(season: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&sportId=1&playerPool=all&group=hitting&season=${season}&sortBy=initLastName&order=asc&limit=10000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.stats[0].splits.filter(
        (player: Hitter) => player.stat.atBats > 0
      );
    }
  } catch (error) {
    console.error("Error fetching all hitters:", error);
    return null;
  }
}

export async function fetchHitterAwards(season: number) {
  try {
    const awardNames = [
      "ALROY",
      "NLROY",
      "ALMVP",
      "NLMVP",
      season !== 2020 && "ALAS",
      season !== 2020 && "NLAS",
      season > 1979 && "ALSS",
      season > 1979 && "NLSS",
      season > 2018 && "MLBAFIRST",
      season > 2018 && "MLBSECOND",
    ];
    const fetchPromises = awardNames
      .filter((award) => award!)
      .map((award) =>
        fetch(
          `https://statsapi.mlb.com/api/v1/awards/${award}/recipients?season=${season}`
        )
      );

    const responses = await Promise.all(fetchPromises);

    if (responses.some((response) => !response.ok)) {
      throw new Error(`HTTP error! One or more requests failed.`);
    }

    const jsonPromises = responses.map((response) => response.json());
    const jsonResults = await Promise.all(jsonPromises);

    const awardRecipients: { name: string; playerId: number }[] = [];

    jsonResults.forEach((result) => {
      const awardName = result.awards[0].id;
      if (
        result &&
        result.awards &&
        result.awards[0] &&
        result.awards[0].player
      ) {
        result.awards.forEach((award: AwardRecipient) => {
          if (award.player && award.player.id) {
            awardRecipients.push({
              name: awardName,
              playerId: award.player.id,
            });
          }
        });
      }
    });
    return awardRecipients;
  } catch (error) {
    console.error("Error fetching hitter awards:", error);
    return null;
  }
}
