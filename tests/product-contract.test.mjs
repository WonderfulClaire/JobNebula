import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("keeps the career intelligence product contract", async () => {
  const [page, layout, packageJson] = await Promise.all([
    read("../app/page.tsx"),
    read("../app/layout.tsx"),
    read("../package.json"),
  ]);

  assert.match(layout, /JobNebula/);
  assert.match(page, /window\.localStorage/);
  assert.match(page, /为什么是它/);
  assert.match(page, /捕获一条新机会/);
  assert.match(page, /最终判断始终由你做出/);

  const pkg = JSON.parse(packageJson);
  assert.equal(pkg.scripts.build, "vinext build");
});

test("contains no starter placeholder copy", async () => {
  const files = await Promise.all([
    read("../app/page.tsx"),
    read("../app/layout.tsx"),
    read("../README.md"),
  ]);
  const source = files.join("\n");
  assert.doesNotMatch(source, /Your site is taking shape|Building your site/);
});
