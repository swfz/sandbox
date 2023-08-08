import {fromMarkdown} from 'mdast-util-from-markdown'
import {frontmatter} from 'micromark-extension-frontmatter'
import {toMarkdown} from 'mdast-util-to-markdown'
import {frontmatterFromMarkdown, frontmatterToMarkdown} from 'mdast-util-frontmatter'
import * as fs from 'fs'
import { dir } from 'console';

const replacer = (str) => {
  return str.replace(/\\\[/g, '[').replace(/\\_/g, '_');
}

const ast = fromMarkdown(fs.readFileSync('sample.md'), {
  extensions: [frontmatter(['yaml'])],
  mdastExtensions: [frontmatterFromMarkdown(['yaml'])]
});
dir(ast, {depth: null});
const options = {
  bullet: '-',
  extensions: [frontmatterToMarkdown(['yaml'])]
}

console.log(replacer(toMarkdown(ast, options)))

fs.writeFileSync('sample_stored.md', toMarkdown(ast, options));
