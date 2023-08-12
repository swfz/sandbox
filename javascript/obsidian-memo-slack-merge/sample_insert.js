import {fromMarkdown} from 'mdast-util-from-markdown'
import {frontmatter} from 'micromark-extension-frontmatter'
import {toMarkdown} from 'mdast-util-to-markdown'
import {frontmatterFromMarkdown, frontmatterToMarkdown} from 'mdast-util-frontmatter'
import * as fs from 'fs'
import { dir } from 'console';

const createContentsAst = (contents) => {
  const items = contents.map((item) => {
    return {
      type: 'listItem',
      spread: false,
      checked: null,
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: item.name,
            },
          ],
        },
      ],
    }
  });

  return {
    type: 'list',
    spread: false,
    children: items,
  }
}

const contentsHeadingAst = {
  type: "heading",
  depth: 2,
  children: [
    {
      type: "text",
      value: "Contents",
    },
  ],
};

const contents = [
  {name: 'Seal'},
  {name: 'Zebra'},
  {name: 'Bear'},
]

const ast = fromMarkdown(fs.readFileSync('sample.md'), {
  extensions: [frontmatter(['yaml'])],
  mdastExtensions: [frontmatterFromMarkdown(['yaml'])]
});
dir(ast, {depth: null});

const targetHeaderIndex = ast.children.findIndex(node => node.type === 'heading' && node.children[0]?.value === 'Tasks');
const contentsAst = createContentsAst(contents);

const children = targetHeaderIndex === -1 ? [...ast.children, contentsHeadingAst, contentsAst] : [
  ...ast.children.slice(0, targetHeaderIndex),
  contentsHeadingAst,
  contentsAst,
  ...ast.children.slice(targetHeaderIndex),
]

const afterAst = { ...ast, ...{children}};

const options = {
  bullet: '-',
  extensions: [frontmatterToMarkdown(['yaml'])]
}

const replacer = (str) => {
  return str.replace(/\\\[/g, '[').replace(/\\_/g, '_').replace(/\\&/g, '&').replace(/\\\*/g, '*');
}

console.log(replacer(toMarkdown(afterAst, options)))
fs.writeFileSync('sample_stored.md', replacer(toMarkdown(afterAst, options)));
