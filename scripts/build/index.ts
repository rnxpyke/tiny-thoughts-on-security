import { Glob, $ } from "bun";
import path from "node:path";

const mds = new Glob('**/*.md');

const outdir = "./out";

for await (const file of mds.scan(".")) {
  const target = file.replace('.md$', '.html');
  const targetDir = path.dirname(target);
  console.log(file, target);
  await $`mkdir -p ${targetDir}`;
  await $`pandoc -t html -f commonmark_x ${file}`;
}
