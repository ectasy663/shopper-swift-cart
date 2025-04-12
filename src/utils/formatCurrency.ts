/**
 * Formats a number as Indian Rupee (INR)
 * @param amount The amount to format
 * @returns Formatted string with ₹ symbol and Indian comma formatting
 */
export const formatINR = (amount: number): string => {
  // Convert to Indian format (with commas at thousands, lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
};
