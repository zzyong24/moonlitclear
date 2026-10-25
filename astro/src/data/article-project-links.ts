// Only connect an article to a product when the article actually discusses that product.
// Keep this explicit so new articles do not inherit unrelated recommendations.
export const articleProjectLinks: Record<string, string> = {
  'child-context-from-birth': 'hean',
  'thirdspace-build': 'thirdspace',
  'aiterm-three-terminals-one-workspace': 'aiterm',
};
