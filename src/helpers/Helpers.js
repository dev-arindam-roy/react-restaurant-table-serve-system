export const formatNumberWord = (input) => {
  return input
    .replace(/-/g, " ") // Replace dashes with spaces
    .replace(/\b\w/g, (match) => match.toUpperCase());
};
