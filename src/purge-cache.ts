import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

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

const urlsToPurge: string[] = [];
pathsArr.forEach((path) => {
  urlsToPurge.push(`https://zachyoung.dev/${path.replace(".md", "")}`);
});

const body = JSON.stringify({ files: urlsToPurge });

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
