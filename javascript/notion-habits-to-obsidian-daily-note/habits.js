import { Client, LogLevel } from "@notionhq/client";
import { fromMarkdown } from "mdast-util-from-markdown";
import { frontmatter } from "micromark-extension-frontmatter";
import { toMarkdown } from "mdast-util-to-markdown";
import {
  frontmatterFromMarkdown,
  frontmatterToMarkdown,
} from "mdast-util-frontmatter";
import * as fs from "fs";

const getHabitsFromPage = async (notion, page) => {
  const pageId = page.id;
  const response = await notion.pages.retrieve({ page_id: pageId });

  // console.log(response);
  const habitKeys = Object.keys(response.properties);

  const properties = habitKeys
    .map((key) => {
      const property = response.properties[key];
      const propType = property.type;

      if (["title", "relation", "formula", "select"].includes(propType)) {
        return null;
      }

      return {
        name: key,
        value: property[propType],
      };
    })
    .filter((p) => p);

  return properties;
};

const markdownToAst = (filename) => {
  const markdown = fs.readFileSync(filename);

  return fromMarkdown(markdown, {
    extensions: [frontmatter(["yaml"])],
    mdastExtensions: [frontmatterFromMarkdown(["yaml"])],
  });
};

const createHabitsAst = (habits) => {
  const items = habits.map((habit) => ({
    type: "listItem",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: `[${habit.value ? "x" : " "}] ${habit.name}`,
          },
        ],
      },
    ],
  }));

  const list = {
    type: "list",
    start: null,
    spread: false,
    children: items,
  };

  return list;
};

const createHabitsHeadingAst = () => {
  return {
    type: "heading",
    depth: 2,
    children: [
      {
        type: "text",
        value: "Habits",
      },
    ],
  };
};

const mergeDailyNote = async (directory, properties) => {
  const date = properties.find((p) => p.name === "date").value.start;
  const obsidianDailyNoteFilename = `${directory}/${date}.md`;

  const existMarkdown = fs.existsSync(obsidianDailyNoteFilename);
  if (!existMarkdown) {
    fs.writeFileSync(obsidianDailyNoteFilename, "");
  }

  const habits = properties.filter((p) => p.name !== "date");
  const ast = markdownToAst(obsidianDailyNoteFilename);

  const habitsAst = createHabitsAst(habits);
  const habitsHeadingAst = createHabitsHeadingAst();

  const existHabits = ast.children.find(
    (item) => item.type === "heading" && item.children[0]?.value === "Habits",
  );

  // すでに作成済みの場合は何もしない
  if (existHabits) {
    return;
  }

  const existMemoHeading = ast.children.find(
    (item) => item.type === "heading" && item.children[0]?.value === "Memo",
  );

  const insertBeforeMemo = (acc, item, i, array) => {
    if (
      array[i + 1]?.type === "heading" &&
      array[i + 1].children[0]?.value === "Memo"
    ) {
      return [...acc, item, habitsHeadingAst, habitsAst];
    }

    return [...acc, item];
  };

  const children = existMemoHeading
    ? ast.children.reduce(insertBeforeMemo, [])
    : [...ast.children, habitsHeadingAst, habitsAst];

  const afterAst = { ...ast, ...{ children } };
  // console.dir(afterAst, {depth: null});

  const options = {
    bullet: "-",
    extensions: [frontmatterToMarkdown(["yaml"])],
  };

  // FIXME: unsafeオプションを使ってエスケープさせないようにしたかったが、うまくいかなかったため場当たり的な対応をしている
  const replacer = (str) => {
    return str
      .replace(/\\\[/g, "[")
      .replace(/\\_/g, "_")
      .replace(/\\&/g, "&")
      .replace(/\\\*/g, "*");
  };

  fs.writeFileSync(
    obsidianDailyNoteFilename,
    replacer(toMarkdown(afterAst, options)),
  );
};

const main = async () => {
  const args = process.argv.slice(2);

  console.log(args);
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
    logLevel: LogLevel.DEBUG,
  });

  const databaseId = process.env.NOTION_DATABASE_ID || "";
  const obsidianDailyNoteDir = args[0];

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  const pages = response.results;

  // ==== 1件で試す
  // const properties = await getHabitsFromPage(notion, pages[0]);
  // console.dir(properties, { depth: null });
  // await mergeDailyNote(obsidianDailyNoteDir, properties);
  // ==== 1件で試す

  Promise.all(
    pages.map(async (page) => {
      const properties = await getHabitsFromPage(notion, page);
      await mergeDailyNote(obsidianDailyNoteDir, properties);
    }),
  );
};

main();
