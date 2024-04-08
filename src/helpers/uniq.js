/**
 * Generates a unique random string using the Math.random() method.
 *
 * @return {string} A unique random string.
 */
export default function uniq() {
  return Math.random().toString(16).slice(2);
}
