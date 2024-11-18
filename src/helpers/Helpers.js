export const formatNumberWord = (input) => {
  return input
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

export const getFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${year}/${month}/${day}`;
};

export const getFormattedTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${getFormattedDate()} ${hours}:${minutes} ${ampm}`;
};
