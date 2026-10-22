export type VideoResource = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
};

// YouTube sends titles with HTML codes like &amp; and &#39;
function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function searchVideos(
  queries: string[],
): Promise<VideoResource[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  const seen = new Set<string>();
  const results: VideoResource[] = [];

  for (const q of queries) {
    try {
      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        maxResults: "3",
        safeSearch: "strict",
        q,
        key,
      });
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${params}`,
        {
          signal: AbortSignal.timeout(8000),
        },
      );
      if (!res.ok) continue;

      const data = await res.json();
      for (const item of data.items ?? []) {
        const id = item.id?.videoId;
        if (!id || seen.has(id)) continue;
        seen.add(id);
        results.push({
          id,
          title: decode(item.snippet.title),
          channel: decode(item.snippet.channelTitle),
          thumbnail: item.snippet.thumbnails?.medium?.url ?? "",
        });
      }
    } catch {
      // if one search fails, skip it
    }
  }

  return results.slice(0, 6);
}
