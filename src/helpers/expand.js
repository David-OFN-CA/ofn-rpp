import { CLIENT_CONTEXT } from "@helpers/utils";

export default async () => {
  /**
   * Retrieves a specific field from a given resource based on a predicate.
   * @param {object} resource - The resource to retrieve the field from.
   * @param {string} predicate - The predicate to use for retrieving the field.
   * @returns {string|string[]} The value of the retrieved field.
   */
  return async (resource, predicate) => {
    let r = "";
    const resourceType = await resource["@type"];
    if (import.meta.env.DEV && !resourceType) {
      console.warn(`No @type within ${resource["@id"]}`);
    }
    if (resourceType != "ldp:Container") {
      r = await resource[
        await window.sibStore.getExpandedPredicate(predicate, CLIENT_CONTEXT)
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
