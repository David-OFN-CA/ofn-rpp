let coreInstance = null;

/**
 * Function to retrieve the singleton instance of the core version.
 *
 * @return {Promise} The promise that resolves to the core instance.
 */
export default async function importCore() {
  if (!coreInstance) {
    if (import.meta.env.DEV) {
      try {
        coreInstance = await import("http://localhost:3000/dist/index.js");
      } catch {
        coreInstance = await import("https://cdn.jsdelivr.net/npm/@startinblox/core@1/dist/index.js");
      }
    } else {
      // In production, only return the jsdelivr version
      coreInstance = await import("https://cdn.jsdelivr.net/npm/@startinblox/core@1/dist/index.js");
    }
  }
  return coreInstance;
}
