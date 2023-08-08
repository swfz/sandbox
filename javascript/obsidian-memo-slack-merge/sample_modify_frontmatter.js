import {fromMarkdown} from 'mdast-util-from-markdown'
import {frontmatter} from 'micromark-extension-frontmatter'
import {toMarkdown} from 'mdast-util-to-markdown'
import {frontmatterFromMarkdown, frontmatterToMarkdown} from 'mdast-util-frontmatter'
import yaml from 'js-yaml';
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

const children = ast.children.reduce((acc, item, i, array) => {
  // change frontmatter value
  if (item.type === 'yaml') {
    const data = yaml.load(item.value);
    dir(item);
    dir(data);

    data['added'] = 'AddedValue!';
    const mergedItem = {...item, ...{value: yaml.dump(data)}};
    dir(mergedItem)

    return [...acc, mergedItem];
  }

  return [...acc, item];
}, []);

const afterAst = { ...ast, ...{children}};

const options = {
  bullet: '-',
  extensions: [frontmatterToMarkdown(['yaml'])]
}

console.log(replacer(toMarkdown(afterAst, options)))

fs.writeFileSync('sample_stored.md', replacer(toMarkdown(afterAst, options)));
