import { createCanvas } from 'https://deno.land/x/canvas/mod.ts';

const port = 8080;

const renderTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + 40, y + 40);
  ctx.lineTo(x, y + 80);
  ctx.lineTo(x, y);
  ctx.fill();
}

const renderPrefix = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = '#efb24a';
  ctx.fillText('$', x, y);
};

const breakLines = (ctx: CanvasRenderingContext2D, title: string, maxWidth: number): string[] => {
  const words = title.split('');
  console.log(words);
  

  const processWord = (words, line='', result=[]) => {
    // console.log('words---------------');
    // console.log(words);
    // console.log(line);
    // console.log(result);
    // console.log('result---------------');
    if (words.length === 0) return [...result, line];

    const testLine = `${line}${words[0]}`;
    const testWidth = ctx.measureText(testLine).width;
    // console.log(`${testWidth} > ${maxWidth} ?`);

    return testWidth > maxWidth
      ? processWord(words.slice(1), `${words[0]}`, [...result, line])
      : processWord(words.slice(1), testLine, result);
  }

  return processWord(words);
}

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? 'No Title';
  const tagParam = url.searchParams.get("tags") ?? null;

  const tags = tagParam ? tagParam.split(',') : [];

  console.log(title);
  const [width, height] = [1200, 630];

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = '#2f3e50';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const font = await Deno.readFile('./NotoSansCJK-Regular.ttc');
  canvas.loadFont(font, {
    family: 'notosans',
  });
  ctx.font = "50pt notosans";

  // TODO: タイトル 改行判定
  // TODO: 色再度見る

  const terminalHeaders = ['swfz', 'til'];
  const colors = ['#6797e8', '#a4e083']

  const startPositions = terminalHeaders.reduce((acc, text) => {
    const measured = ctx.measureText(text);
    const x = acc.at(-1) + measured.width;

    return [...acc, x];
  }, [0]);

  terminalHeaders.forEach((text, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(startPositions[i], 30, ctx.measureText(text).width, 80);
    ctx.fillStyle = '#EFEFEF';
    ctx.fillText(text, startPositions[i] + 50, 90);
  });
  terminalHeaders.forEach((text, i) => {
    renderTriangle(ctx, startPositions[i+1], 30, colors[i])
  });
  renderPrefix(ctx, 10, 200);

  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('article --title \\', 80, 200);
  // ctx.fillStyle = '#FFFFFF';
  // ctx.fillText(title, 50, 300);

  const titleLines = breakLines(ctx, title, 1150);

  ctx.fillStyle = '#FFFFFF';

  titleLines.forEach((line, i) => {
    ctx.fillText(line, 50, 300 + i*100)
  });

  const lastLineWidth = ctx.measureText(titleLines.at(-1)).width;
  const cursorX = 50 + lastLineWidth + 10;
  const cursorY = 200 + 30 + (titleLines.length -1) * 100;

  // renderPrefix(ctx, 10, 400);

  if(tagParam && tagParam.length > 0) {
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('tags', 80, 400);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(tags.join(' '), 50, 500);
  }

  // renderPrefix(ctx, 10, 600);
  ctx.fillStyle = '#ec80f7';
  // ctx.fillRect(70,520,50,100);
  ctx.fillRect(cursorX, cursorY, 50, 100);


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
