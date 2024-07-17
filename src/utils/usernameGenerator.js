export const generateUsername = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric characters with '-'
    .replace(/-+/g, "-") // Replace multiple '-' with a single '-'
    .trim();
};
