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

const pathsArr: string[] = JSON.parse(paths.replaceAll("\\", ""));

const urlsToPurge: Set<string> = new Set();
pathsArr.forEach((pathWithExtension) => {
  const path = pathWithExtension.replace(".md", "");
  urlsToPurge.add(`${BASE_URL}/${path}`);
  urlsToPurge.add(`${BASE_URL}/${path.split("/")[0]}`);
});

const body = JSON.stringify({ files: Array.from(urlsToPurge) });

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
  body,
};

await fetch(
  `https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`,
  options,
);
