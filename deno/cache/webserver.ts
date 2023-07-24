import { serve } from "https://deno.land/std@0.194.0/http/server.ts";

// Open a cache named v1.
const CACHE = await caches.open("v1");

serve(async (req: Request) => {
  console.dir(req, {depth: null})
  // Requests after first request are served from cache.
  const res = await CACHE.match(req);
  if (res) {
    console.log('cache hit');
    res.headers.set("x-cache-hit", "true");
    return res;
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const response = new Response(`Hello ${name}!`);
  // Put response in cache.
  await CACHE.put(req, response.clone());
  return response;
});
