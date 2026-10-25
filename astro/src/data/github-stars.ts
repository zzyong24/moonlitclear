import snapshot from './github-stats.json';

export function githubStars(url: string): number | undefined {
  const match = /^https:\/\/github\.com\/zzyong24\/([^/?#]+)\/?$/i.exec(url);
  if (!match) return undefined;
  return (snapshot.repos as Record<string, { stars: number }>)[match[1].toLowerCase()]?.stars;
}
