import { createCanvas } from 'https://deno.land/x/canvas/mod.ts';
import TinySegmenter from "https://esm.sh/tiny-segmenter@0.2.0";

const port = 8080;
const textLineBase = 100;
const statusLineBase = 80;
const triangleBase = 40;

const renderTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, direction: 'left'|'right') => {
  const base = triangleBase;
  ctx.fillStyle = color;

  const vertexX = direction === 'left' ? x - base : x + base;
  const vertexY = y + base;

  ctx.beginPath();
  ctx.moveTo(vertexX, vertexY);
  ctx.lineTo(x, y + (base * 2));
  ctx.lineTo(x, y);
  ctx.fill();
}

const renderPrefix = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = '#efb24a';
  ctx.fillText('$', x, y);
};

const selectASCII = (str: string) => {
  const matches = str.match(/[\x00-\x7F]/g);

  return matches ?? [];
}

// ASCII文字列を含めてmeasureTextを通すとASCII文字列の分だけマルチバイトで判断されている？ようなので半分にする
const measureTextWithASCII = (ctx: CanvasRenderingContext2D, str: string) => {
  const fullWidth = ctx.measureText(str).width;
  const ascii = selectASCII(str);
  const asciiWidth = ctx.measureText(ascii.join("")).width;

  return fullWidth - (asciiWidth * 0.4);
}

const breakLines = (ctx: CanvasRenderingContext2D, title: string, maxWidth: number): string[] => {
  const segmenter = new TinySegmenter();
  const segments = segmenter.segment(title);

  const processWord = (segments, line='', result=[]) => {
    if (segments.length === 0) return [...result, line];

    const testLine = `${line}${segments[0]}`;
    const testWidth = measureTextWithASCII(ctx, testLine);

    return testWidth > maxWidth
      ? processWord(segments.slice(1), `${segments[0]}`, [...result, line])
      : processWord(segments.slice(1), testLine, result);
  }

  return processWord(segments);
}

const renderStatusLine = (ctx: CanvasRenderingContext2D) => {
}

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? 'No Title';
  const tagsParam = url.searchParams.get("tags");
  const tags = tagsParam ? tagsParam.split(',') : [];

  const [width, height] = [1200, 630];

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = '#313d4f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.log(ctx.font);
  ctx.font = "50pt monospace";
  console.log('monospace:', ctx.measureText(title).width);

  const font = await Deno.readFile('./NotoSansCJK-Regular.ttc');
  canvas.loadFont(font, {
    family: 'notosans',
  });
  ctx.font = "50pt notosans";

  // StatusLine
  const terminalHeaders = ['swfz', 'til'];
  const colors = ['#6797e8', '#a4e083', '#efb24a', '#ec7563'];

  const startPositions = terminalHeaders.reduce((acc, text) => {
    const measured = measureTextWithASCII(ctx, text);
    const x = acc.at(-1) + measured;

    return [...acc, x];
  }, [0]);

  terminalHeaders.forEach((text, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(startPositions[i], 30, measureTextWithASCII(ctx, text), 80);
    ctx.fillStyle = '#555';
    ctx.fillText(text, startPositions[i] + 10 + (i * 40), 90);
  });
  terminalHeaders.forEach((_, i) => {
    renderTriangle(ctx, startPositions[i+1], 30, colors[i], 'right')
  });
  renderPrefix(ctx, 10, textLineBase * 2);

  // Command
  ctx.fillStyle = '#888';
  ctx.fillText('article --title \\', 80, textLineBase * 2);

  console.log('title:', ctx.measureText(title).width);

  // Title
  const titleLines = breakLines(ctx, title, 1150);
  ctx.fillStyle = '#FFFFFF';
  titleLines.forEach((line, i) => {
    ctx.fillText(line, 50, 300 + i*textLineBase)
  });

  // Cursor
  const lastLineWidth = measureTextWithASCII(ctx, titleLines.at(-1));
  const cursorX = 50 + lastLineWidth + 10;
  const cursorY = 200 + 30 + (titleLines.length -1) * 100;

  ctx.fillStyle = '#ec80f7';
  ctx.fillRect(cursorX, cursorY, 50, 100);

  // タイトル表示を優先させるため、タイトルが3行までの場合はTagも表示させる
  if (tags.length > 0 && titleLines.length <= 3) {
    // Tags
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 540, 1200, 80);
    ctx.fillStyle = '#999';
    ctx.fillText('Tags', 10, 600);

    const tagsStartPositions = tags.reverse().reduce((acc, tag, i) => {
      const measured = measureTextWithASCII(ctx, tag);
      const x = acc.at(-1) - measured - (triangleBase * i);

      return [...acc, x];
    }, [1200]).reverse();

    const tagColors = colors;
    tags.reverse().forEach((tag, i) => {
      ctx.fillStyle = tagColors[i];
      ctx.fillRect(tagsStartPositions[i], 540, measureTextWithASCII(ctx, tag) + (triangleBase * (tags.length - i)), 80);
      ctx.fillStyle = '#555';
      ctx.fillText(tag, tagsStartPositions[i], 600);
    });
    tags.reverse().forEach((_, i) => {
      renderTriangle(ctx, tagsStartPositions[i], 540, tagColors[i], 'left')
    });
  }

  const headers = new Headers();
  headers.set("content-type", "image/png");

  const response = new Response(canvas.toBuffer(), {
    headers: headers,
    status: 200,
  });

  return response;
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
Deno.serve({port}, handler);
