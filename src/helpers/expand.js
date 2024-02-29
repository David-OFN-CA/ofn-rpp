import { importCore, CLIENT_CONTEXT } from "@helpers/utils";

export default async () => {
  const core = await importCore();
  /**
   * Retrieves a specific field from a given resource based on a predicate.
   * @param {object} resource - The resource to retrieve the field from.
   * @param {string} predicate - The predicate to use for retrieving the field.
   * @returns {string|string[]} The value of the retrieved field.
   */
  return async (resource, predicate) => {
    let r = "";
    if ((await resource["@type"]) != "ldp:Container") {
      r = await resource[
        await core.store.getExpandedPredicate(predicate, CLIENT_CONTEXT)
      ];
    } else {
      r = await resource.getResourceData()[predicate];
    }
    if (import.meta.env.DEV && !r) {
      console.warn(`No ${predicate} field within ${resource["@id"]}`);
    }
    return r;
  }
};
