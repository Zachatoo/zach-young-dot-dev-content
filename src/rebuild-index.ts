import {
  extract,
  test,
} from "https://deno.land/std@0.176.0/encoding/front_matter/any.ts";
import GitHubSlugger from "npm:github-slugger@^2.0";

const INCLUDE_DIRECTORIES = [
  "blog",
  "snippets",
];

interface IFrontmatterBasic {
  title: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  headings: {
    display: string;
    anchor: string;
  }[];
}
type Frontmatter = IFrontmatterBasic & {
  slug: string;
  path: string;
};

const index: Frontmatter[] = [];

for await (const dirEntry of Deno.readDir("./")) {
  if (
    dirEntry.isDirectory &&
    INCLUDE_DIRECTORIES.some((x) => x === dirEntry.name)
  ) {
    for await (const nestedDirEntry of Deno.readDir(`./${dirEntry.name}`)) {
      if (nestedDirEntry.isFile) {
        const fileName = `./${dirEntry.name}/${nestedDirEntry.name}`;
        const fileContents = await Deno.readTextFile(fileName);

        if (test(fileContents)) {
          const { title, createdAt, updatedAt, description, tags } =
            extract(fileContents).attrs;
          const extractedAttrs = {
            title,
            createdAt,
            updatedAt,
            description,
            tags,
          };

          if (isFrontmatterValid(extractedAttrs)) {
            const path = `/${dirEntry.name}/${nestedDirEntry.name}`;
            index.push({
              slug: path.replace(/\.md(x)?$/, ""),
              path,
              ...extractedAttrs,
              headings: parseHeadings(fileContents),
            });
          } else {
            console.info(
              `Invalid frontmatter for ./${dirEntry.name}/${nestedDirEntry.name}\n${extractedAttrs}`,
            );
          }
        } else {
          console.info(
            `No frontmatter found for ./${dirEntry.name}/${nestedDirEntry.name}`,
          );
        }
      }
    }
  }
}

index.sort(sortByCreatedAtThenTitle);

await writeJson("./index.json", index);

function isFrontmatterValid(
  attrs: {
    title: unknown;
    createdAt: unknown;
    description: unknown;
    tags: unknown;
  },
): attrs is IFrontmatterBasic {
  return typeof attrs.title === "string" &&
    typeof attrs.createdAt === "string" &&
    typeof attrs.description === "string" && isArrayOfStrings(attrs.tags);
}

function isArrayOfStrings(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((x) => typeof x === "string");
}

function parseHeadings(contents: string) {
  const slugger = new GitHubSlugger();
  // Remove codeblocks to avoid comment syntax in some codeblocks
  const contentsWithoutCodeblocks = contents.replaceAll(/```(.|\n)+?```/gm, "");
  const headingsWithoutMarkdown = contentsWithoutCodeblocks
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((heading) => heading.replaceAll(/((#+) |_|\*)/g, ""));
  const headings = headingsWithoutMarkdown.map((heading) => {
    const dashCaseHeading = heading
      .split(" ")
      .map((word) => `${word[0].toLowerCase()}${word.substring(1)}`)
      .join(" ");
    const anchor = slugger.slug(dashCaseHeading);
    return {
      display: heading,
      anchor,
    };
  });
  return headings;
}

async function writeJson(path: string, content: unknown) {
  try {
    await Deno.writeTextFile(path, JSON.stringify(content, null, 2));
  } catch (e) {
    console.log(e);
  }
}

function sortByCreatedAtThenTitle(a: Frontmatter, b: Frontmatter) {
  const aCreatedAt = new Date(a.createdAt).valueOf();
  const bCreatedAt = new Date(b.createdAt).valueOf();
  if (aCreatedAt < bCreatedAt) {
    return 1;
  } else if (aCreatedAt > bCreatedAt) {
    return -1;
  }

  return a.title > b.title ? 1 : -1;
}
