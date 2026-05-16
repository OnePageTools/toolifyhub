
/**
 * Utility functions for sanitizing user input to prevent XSS and other injection attacks.
 */

/**
 * Escapes common HTML characters and trims/slices input.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 10000);
}

/**
 * Ensures a value is a number within a specified range.
 */
export function sanitizeNumber(
  input: any, 
  min: number, 
  max: number
): number {
  const num = typeof input === 'number' ? input : parseFloat(input);
  if (isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}
