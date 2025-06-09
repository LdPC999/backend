export const optimizeCloudinaryUrl = (url, width = 400) => {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};