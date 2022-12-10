import { parse } from "https://deno.land/std@0.167.0/flags/mod.ts";

const flags = parse(Deno.args, {
  string: ["paths"],
});

const { paths } = flags;
if (!paths) {
  console.error("--paths is required");
  Deno.exit();
}

const pathsArr: string[] = JSON.parse(paths.replaceAll("\\", ""));

const urlsToPurge: string[] = [];
pathsArr.forEach((path) => {
  urlsToPurge.push(`https://zachyoung.dev/${path.replace(".md", "")}`);
});
console.log(urlsToPurge);
