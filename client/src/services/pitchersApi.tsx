import { Pitcher, AwardRecipient } from "../types/pitching.types";

export async function fetchQualifiedPitchers(season: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&sportId=1&group=pitching&season=${season}&sortBy=initLastName&order=asc&limit=10000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.stats[0].splits.filter(
        (player: Pitcher) => Number(player.stat.inningsPitched) > 0
      );
    }
  } catch (error) {
    console.error("Error fetching qualified pitchers:", error);
    return null;
  }
}

export async function fetchAllPitchers(season: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/stats?stats=season&sportId=1&playerPool=all&group=pitching&season=${season}&sortBy=initLastName&order=asc&limit=10000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data && season < 1974) {
      console.log(data);
      return data.stats[0].splits.filter(
        (player: Pitcher) =>
          Number(player.stat.inningsPitched) > 0 && player.stat.baseOnBalls > 0
      );
    } else if (data && season > 1973) {
      console.log(data);
      return data.stats[0].splits.filter(
        (player: Pitcher) =>
          Number(player.stat.inningsPitched) > 0 &&
          player.stat.baseOnBalls > 0 &&
          player.stat.airOuts > 0 &&
          player.stat.numberOfPitches - player.stat.strikes > 0
      );
    }
  } catch (error) {
    console.error("Error fetching all pitchers:", error);
    return null;
  }
}

export async function fetchPitcherThrowingHand(id: number) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/people/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data.people[0].pitchHand.code;
    }
  } catch (error) {
    console.error("Error fetching all pitchers:", error);
    return null;
  }
}

export async function fetchPitcherAwards(season: number) {
  try {
    const awardNames = [
      "ALROY",
      "NLROY",
      "ALMVP",
      "NLMVP",
      season !== 2020 && "ALAS",
      season !== 2020 && "NLAS",
      season > 1966 && "ALCY",
      season > 1966 && "NLCY",
      season > 1955 && season < 1967 && "MLBCY",
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
