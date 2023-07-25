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
  // ctx.fillStyle = '#666';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // const font = await Deno.readFile('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
  const font = await Deno.readFile('./NotoSansCJK-Regular.ttc');
  canvas.loadFont(font, {
    family: 'notosans',
  });
  ctx.font = "50pt notosans";

  // ctx.fillStyle = '#222222';
  // ctx.fillRect(0,0,1200,50);
  // ctx.fillRect(0,580,1200,630);

  // TODO: タイトル 改行判定
  // TODO: 色再度見る

  const terminalHeaders = ['swfz', 'til'];
  const colors = ['#6797e8', '#a4e083']

  const startPositions = terminalHeaders.reduce((acc, text) => {
    const measured = ctx.measureText(text);
    const x = acc.at(-1) + measured.width;

    return [...acc, x];
  }, [0]);

  console.log(startPositions);

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
  ctx.fillText('title', 80, 200);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(title, 50, 300);

  console.log(ctx.measureText(title))

  // renderPrefix(ctx, 10, 400);

  if(tagParam && tagParam.length > 0) {
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('tags', 80, 400);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(tags.join(' '), 50, 500);
  }

  renderPrefix(ctx, 10, 600);
  ctx.fillStyle = '#e95295';
  ctx.fillRect(70,520,50,100);


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
