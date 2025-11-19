import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response("OK", { status: 200 });
  }

  if (url.pathname === "/m3u") {
    const src = url.searchParams.get("src");
    if (!src) return new Response("Missing src", { status: 400 });

    try {
      const res = await fetch(src, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!res.ok) {
        return new Response("Upstream error", { status: 502 });
      }

      const body = await res.text();
      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Cache-Control": "no-store",
        },
      });
    } catch (e) {
      return new Response("Fetch failed", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
});

