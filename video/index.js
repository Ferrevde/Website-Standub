export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = request.headers.get("Origin") || "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Auth",
      "Access-Control-Max-Age": "86400"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const checkAuth = () => {
      const auth = request.headers.get("X-Admin-Auth") || "";
      if (!env.ADMIN_PASSWORD || auth !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return null;
    };

    // GET /video
    if (path === "/video" && request.method === "GET") {
      try {
        const raw = await env.VIDEO.get("youtube-video");
        let cfg = { url: "", enabled: false };
        if (raw) {
          try { cfg = JSON.parse(raw); } catch {}
        }
        if (!cfg || typeof cfg !== "object") cfg = { url: "", enabled: false };
        if (cfg.url === undefined) cfg.url = "";
        if (cfg.enabled === undefined) cfg.enabled = false;
        return new Response(JSON.stringify(cfg), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ url: "", enabled: false }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // PUT /video (auth)
    if (path === "/video" && request.method === "PUT") {
      const authResp = checkAuth();
      if (authResp) return authResp;
      try {
        const body = await request.json();
        if (!body || typeof body !== "object") throw new Error("Invalid body");
        const urlStr = body.url || "";
        if (urlStr && typeof urlStr === "string") {
          try { const u = new URL(urlStr); if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Invalid URL protocol"); } catch { throw new Error("Invalid URL"); }
          if (!/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(urlStr) && !urlStr.includes("youtube.com/watch") && !urlStr.includes("youtu.be")) {
            // Allow valid youtube URLs; reject others
            // Actually be stricter: must contain youtube.com/watch or youtu.be
            const uHost = (new URL(urlStr)).hostname; if (!uHost.includes('youtube.com') && !uHost.includes('youtu.be')) throw new Error('URL must be YouTube');
          }
        }
        const cfg = {
          url: typeof urlStr === "string" ? urlStr.trim() : "",
          enabled: !!body.enabled
        };
        await env.VIDEO.put("youtube-video", JSON.stringify(cfg));
        return new Response(JSON.stringify({ success: true, cfg }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message || "Invalid data" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // DELETE /video (auth)
    if (path === "/video" && request.method === "DELETE") {
      const authResp = checkAuth();
      if (authResp) return authResp;
      try {
        await env.VIDEO.put("youtube-video", JSON.stringify({ url: "", enabled: false }));
        return new Response(JSON.stringify({ success: true, reset: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Failed to reset" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
};
