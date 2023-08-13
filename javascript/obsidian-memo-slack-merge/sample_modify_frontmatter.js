import {fromMarkdown} from 'mdast-util-from-markdown'
import {frontmatter} from 'micromark-extension-frontmatter'
import {toMarkdown} from 'mdast-util-to-markdown'
import {frontmatterFromMarkdown, frontmatterToMarkdown} from 'mdast-util-frontmatter'
import yaml from 'js-yaml';
import * as fs from 'fs'
import { dir } from 'console';

const replacer = (str) => {
  return str.replace(/\\\[/g, '[').replace(/\\_/g, '_').replace(/\\&/g, '&').replace(/\\\*/g, '*');
}

const ast = fromMarkdown(fs.readFileSync('sample.md'), {
  extensions: [frontmatter(['yaml'])],
  mdastExtensions: [frontmatterFromMarkdown(['yaml'])]
});
dir(ast, {depth: null});

const children = ast.children.map(node => {
  // change frontmatter value
  if (node.type === 'yaml') {
    const frontmatter = yaml.load(node.value);
    const mergedFrontmatter = {...frontmatter, ...{added: '2023-08-01', empty: '', month: '2023-08'}};

    console.log('yaml =========================');
    console.log(yaml.dump(mergedFrontmatter));

    return {...node, ...{value: yaml.dump(mergedFrontmatter)}};
  }

  return node;
});

const afterAst = { ...ast, ...{children}};

const options = {
  bullet: '-',
  extensions: [frontmatterToMarkdown(['yaml'])]
}

console.log('markdown =========================');
console.log(replacer(toMarkdown(afterAst, options)))

fs.writeFileSync('sample_stored.md', replacer(toMarkdown(afterAst, options)));
