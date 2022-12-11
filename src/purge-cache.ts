import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const BASE_URL = "https://zachyoung.dev";

const flags = parse(Deno.args, {
  string: ["paths", "token", "zone"],
});

const { paths, token, zone } = flags;
if (!paths) {
  console.error("--paths is required");
  Deno.exit(1);
}
if (!token) {
  console.error("--token is required");
  Deno.exit(1);
}
if (!zone) {
  console.error("--zone is required");
  Deno.exit(1);
}

const pathsArr = JSON.parse(paths.replaceAll("\\", ""));
if (
  !Array.isArray(pathsArr) ||
  !pathsArr.every((path) => typeof path === "string")
) {
  console.error("--paths must be an array of strings");
  Deno.exit(1);
}

const urlsToPurge: Set<string> = new Set();
pathsArr.forEach((pathWithExtension: string) => {
  if (!(typeof pathWithExtension === "string")) {
    return;
  }

  const path = pathWithExtension.replace(/\.md(x)?$/, "");
  const route = path.split("/")[0];

  // SSR doc request for page
  urlsToPurge.add(`${BASE_URL}/${path}`);
  // SSR doc request for parent page
  urlsToPurge.add(`${BASE_URL}/${route}`);
  // JSON request for page
  urlsToPurge.add(`${BASE_URL}/${path}?_data=routes%2F${route}.%24slug`);
  // JSON request for parent page
  urlsToPurge.add(`${BASE_URL}/${route}?_data=routes%2F${route}`);
});

const BATCH_SIZE = 30;
let currBatchIndex = 0;

const batches = Array.from(urlsToPurge).reduce((acc, curr) => {
  if (acc[currBatchIndex].length >= BATCH_SIZE) {
    currBatchIndex++;
    acc[currBatchIndex] = [];
  }
  acc[currBatchIndex].push(curr);
  return acc;
}, [[]] as string[][]);

console.info("Purging the following urls", batches);

batches.forEach(async (batch, index) => {
  console.info(`Processing batch ${index + 1}`);
  await purgeCachedFiles(batch);
  console.info(`Finished processing batch ${index + 1}`);
});

function purgeCachedFiles(files: string[]) {
  const body = JSON.stringify({ files });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body,
  };

  return fetch(
    `https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`,
    options,
  );
}
