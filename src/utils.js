const componentName = "ofn-rpp";

export function path() {
  let path = ".";
  return path;
}

export function coreVersion() {
  let coreUrl = "https://cdn.skypack.dev/@startinblox/core";
  return coreUrl;
}

export function uniq() {
  return Math.random().toString(16).slice(2);
}

export const CLIENT_CONTEXT = {
  "@vocab": "",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "doap": "http://usefulinc.com/ns/doap#",
  "ldp": "http://www.w3.org/ns/ldp#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
  "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
  "acl": "http://www.w3.org/ns/auth/acl#",
  "dfc": "https://github.com/datafoodconsortium/ontology/releases/latest/download/DFC_FullModel.owl#",
  "dc": "http://purl.org/dc/elements/1.1/#",
  "dfc-b": "https://github.com/datafoodconsortium/ontology/releases/latest/download/DFC_BusinessOntology.owl#",
  "dfc-p": "https://github.com/datafoodconsortium/ontology/releases/latest/download/DFC_ProductGlossary.owl#",
  "dfc-t": "https://github.com/datafoodconsortium/ontology/releases/latest/download/DFC_TechnicalOntology.owl#",
  "dfc-m": "https://github.com/datafoodconsortium/taxonomies/releases/latest/download/measures.rdf#",
  "dfc-pt": "https://github.com/datafoodconsortium/taxonomies/releases/latest/download/productTypes.rdf#",
  "dfc-f": "https://github.com/datafoodconsortium/taxonomies/releases/latest/download/facets.rdf#",
  "ontosec": "http://www.semanticweb.org/ontologies/2008/11/OntologySecurity.owl#",
  "name": "name",
  "ofn:First_Nations_country": "ofn:first_nations_country",
};

export const sanitize = (input, stripTags=true) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = input;
  if(stripTags) {
    return tmp.textContent || tmp.innerText || "";
  } else {
    return tmp.innerHTML;
  }
};

export const truncate = (str, length) => {
  if (str.length > length) {
    const lastSpaceIndex = str.substr(0, length).lastIndexOf(" ");
    str =
      lastSpaceIndex !== -1
        ? str.substr(0, lastSpaceIndex) + "..."
        : str.substr(0, length) + "...";
  }
  return str;
};
