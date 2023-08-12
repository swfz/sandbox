import {fromMarkdown} from 'mdast-util-from-markdown'
import {frontmatter} from 'micromark-extension-frontmatter'
import {toMarkdown} from 'mdast-util-to-markdown'
import {frontmatterFromMarkdown, frontmatterToMarkdown} from 'mdast-util-frontmatter'
import * as fs from 'fs'
import { dir } from 'console';

const replacer = (str) => {
  return str.replace(/\\\[/g, '[').replace(/\\_/g, '_').replace(/\\&/g, '&').replace(/\\\*/g, '*');
}

const removePositionFromAst = (node) => {
  if (node.children) {
    node.children.map(node => removePositionFromAst(node));
  }
  delete node.position;

  return node;
}

const ast = fromMarkdown(fs.readFileSync('sample.md'), {
  extensions: [frontmatter(['yaml'])],
  mdastExtensions: [frontmatterFromMarkdown(['yaml'])]
});
dir(removePositionFromAst(ast), {depth: null});
const options = {
  bullet: '-',
  extensions: [frontmatterToMarkdown(['yaml'])]
}

console.log(replacer(toMarkdown(ast, options)))

fs.writeFileSync('sample_stored.md', replacer(toMarkdown(ast, options)));
