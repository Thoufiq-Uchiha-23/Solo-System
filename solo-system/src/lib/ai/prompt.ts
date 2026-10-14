export function buildPrompt(title: string, description?: string) {
  return `You are a goal-planning assistant. Break this goal into 3-8 ordered, concrete quests the user can act on directly.
Goal: ${title}
${description ? `Details: ${description}` : ""}
Return ONLY JSON: {"quests":[{"title":string,"description":string,"difficulty":"easy"|"medium"|"hard"}],"youtubeQueries":[string]}
youtubeQueries: 1-2 YouTube search queries for learning how to achieve this goal.`;
}