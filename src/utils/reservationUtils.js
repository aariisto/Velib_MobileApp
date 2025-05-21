/**
 * Generates a random 8-digit numeric confirmation ID
 * @returns {string} An 8-digit string of numbers
 */
export const generateConfirmationID = () => {
  // Generate a random number between 10000000 and 99999999 (8 digits)
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return randomNum.toString();
};
