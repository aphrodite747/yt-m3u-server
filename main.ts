import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response("OK: yt-m3u-proxy", { status: 200 });
  }

  if (url.pathname === "/m3u") {
    const src = url.searchParams.get("src");
    if (!src) return new Response("Missing src", { status: 400 });

    try {
      const res = await fetch(src, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!res.ok) return new Response("Upstream error", { status: 502 });

      const text = await res.text();

      return new Response(text, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } catch {
      return new Response("Fetch failed", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
});
