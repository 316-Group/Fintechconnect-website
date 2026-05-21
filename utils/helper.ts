// utils/helpers.ts
export const getPath = (path: string) => {
  const repoName = '/Fintechconnect-website';
  
  // If in development mode (running localhost), return the path as is
  if (process.env.NODE_ENV !== 'production') return path;
  
  // If the path already includes the repo name, don't duplicate it
  if (path.startsWith(repoName)) return path;
  
  return `${repoName}${path}`;
};