// Converts an ISO date from the API into YYYY-MM-DD in local time for <input type="date">
export const toDateInputValue = (iso: string) => {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split("T")[0];
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
