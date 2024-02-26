export default function(core, utils) {return async function (resource, predicate) {
  let r = "";
  if ((await resource["@type"]) != "ldp:Container") {
    r = await resource[
      await core.store.getExpandedPredicate(predicate, utils.CLIENT_CONTEXT)
    ];
  } else {
    r = await resource.getResourceData()[predicate];
  }
  if(import.meta.env.DEV && !r) {
    console.warn(`No ${predicate} field within ${resource["@id"]}`);
  }
  return r;
}};