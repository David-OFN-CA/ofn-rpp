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
        console.log("Core: Local");
      } catch {
        coreInstance = await import("https://cdn.skypack.dev/@startinblox/core");
        console.log("Core: Skypack");
      }
    } else {
      // In production, only return the skypack version
      coreInstance = await import("https://cdn.skypack.dev/@startinblox/core");
    }
  }
  return coreInstance;
}
