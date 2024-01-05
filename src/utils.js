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
  dfc: "dfc",
  dc: "dc",
  "dfc-b": "dfc-b",
  "dfc-p": "dfc-p",
  "dfc-t": "dfc-t",
  "dfc-m": "dfc-m",
  "dfc-pt": "dfc-p",
  "dfc-f": "dfc-f",
  ontosec: "ontosec",
  name: "name",
  "ofn:First_Nations_country": "ofn:first_nations_country",
};

export const sanitize = (input) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = input;
  return tmp.textContent || tmp.innerText || "";
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
