import { createCanvas } from 'https://deno.land/x/canvas/mod.ts';
import { serve } from "https://deno.land/std@0.194.0/http/server.ts";

const port = 8080;

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? null;

  console.log(title);
  const canvas = createCanvas(1200, 630);
  // const canvas = Canvas.createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = '#000033';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const font = await Deno.readFile('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');
  canvas.loadFont(font, {
    family: 'hoge',
  });
  ctx.font = "50pt hoge";

  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('あああswfz[:memo]<<TIL ', 100, 100);

  ctx.fillStyle = '#FCAF17';
  ctx.fillText('$', 100, 100);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(title, 300, 300);

  const font2 = await Deno.readFile('/usr/share/fonts/truetype/lato/Lato-Regular.ttf');
  canvas.loadFont(font2, {
    family: 'Latoa',
  });
  ctx.font = "bold 50pt Latoa";

  ctx.fillText(title, 300, 400);

  ctx.fillStyle = '#e95295';
  ctx.fillRect(800,300,50,100);


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
