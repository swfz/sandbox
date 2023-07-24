import { createCanvas } from 'https://deno.land/x/canvas/mod.ts';
import { serve } from "https://deno.land/std@0.194.0/http/server.ts";

const port = 8080;

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? null;
  const tagParam = url.searchParams.get("tags") ?? null;

  const tags = tagParam ? tagParam.split(',') : [];

  console.log(title);
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = '#000033';
  // ctx.fillStyle = '#666';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // const font = await Deno.readFile('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
  const font = await Deno.readFile('./NotoSansCJK-Regular.ttc');
  canvas.loadFont(font, {
    family: 'hoge',
  });
  ctx.font = "70pt hoge";

  // ctx.fillStyle = '#222222';
  // ctx.fillRect(0,0,1200,50);
  // ctx.fillRect(0,580,1200,630);

  // TODO: タイトル強調
  // TODO: タイトル 改行判定
  // TODO: ターミナル風
  // TODO: 色再度見る
  // TODO: 同じ処理をどうしよう
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('> swfz > TIL >', 10, 100);

  ctx.fillStyle = '#FCAF17';
  ctx.fillText('$', 10, 200);
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('title', 80, 200);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(title, 50, 300);

  console.log(ctx.measureText(title))

  ctx.fillStyle = '#FCAF17';
  ctx.fillText('$', 10, 400);
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('tags', 80, 400);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(tags.join(' '), 50, 500);

  ctx.fillStyle = '#FCAF17';
  ctx.fillText('$', 10, 600);
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
await serve(handler, { port });
