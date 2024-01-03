const componentName = 'ofn-rpp';

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
