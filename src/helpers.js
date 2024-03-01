// update the date format based on the user's region
export const formatDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
}