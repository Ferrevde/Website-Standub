export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS: reflect request origin when present (accept pages + worker origins)
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

    // Helper: check auth for write operations
    const checkAuth = () => {
      const auth = request.headers.get("X-Admin-Auth") || "";
      if (!env.ADMIN_PASSWORD || auth !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return null;
    };

    // GET /api/tour-dates
    if (path === "/api/tour-dates" && request.method === "GET") {
      try {
        const dataRaw = await env.TOUR_DATES.get("tour-dates");
        let data = [];
        if (dataRaw) {
          try { data = JSON.parse(dataRaw); } catch (e) { data = []; }
        }
        if (!Array.isArray(data)) data = [];
        const now = new Date();
        const upcoming = data.filter(d => {
          try { return new Date(d.date) >= new Date(now.toISOString().split("T")[0]); } catch { return false; }
        });
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        return new Response(JSON.stringify(upcoming), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify([]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // PUT /api/tour-dates (auth required)
    if (path === "/api/tour-dates" && request.method === "PUT") {
      const authResp = checkAuth();
      if (authResp) return authResp;
      try {
        const body = await request.json();
        if (!body || typeof body !== "object") throw new Error("Invalid body");
        // Validate at least one item or full array? Accept array for simplicity; for single item, wrap
        let payload = Array.isArray(body) ? body : [body];
        for (const item of payload) {
          if (!item || typeof item !== "object") throw new Error("Invalid item");
          if (!item.id || typeof item.id !== "string") item.id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
          if (!item.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(item.date))) throw new Error("Invalid date: " + item.date);
          if (!item.venue || typeof item.venue !== "string" || item.venue.trim().length === 0) throw new Error("Missing venue");
          if (!item.city || typeof item.city !== "string" || item.city.trim().length === 0) throw new Error("Missing city");
          if (item.url && typeof item.url === "string") {
            try { const u = new URL(item.url); if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Invalid URL protocol"); } catch { throw new Error("Invalid URL"); }
          }
          if (item.soldOut !== undefined && typeof item.soldOut !== "boolean") item.soldOut = !!item.soldOut;
        }
        // Read current, merge/update by id, write back
        const existingRaw = await env.TOUR_DATES.get("tour-dates");
        let existing = [];
        try { if (existingRaw) existing = JSON.parse(existingRaw); } catch {}
        if (!Array.isArray(existing)) existing = [];
        for (const item of payload) {
          const idx = existing.findIndex(e => e.id === item.id);
          if (idx >= 0) existing[idx] = item; else existing.push(item);
        }
        await env.TOUR_DATES.put("tour-dates", JSON.stringify(existing));
        return new Response(JSON.stringify({ success: true, count: payload.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message || "Invalid data" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // DELETE /api/tour-dates/:id (auth required)
    if (path.startsWith("/api/tour-dates/") && request.method === "DELETE") {
      const authResp = checkAuth();
      if (authResp) return authResp;
      const id = path.replace("/api/tour-dates/", "");
      try {
        const existingRaw = await env.TOUR_DATES.get("tour-dates");
        let existing = [];
        try { if (existingRaw) existing = JSON.parse(existingRaw); } catch {}
        if (!Array.isArray(existing)) existing = [];
        const filtered = existing.filter(e => e.id !== id);
        await env.TOUR_DATES.put("tour-dates", JSON.stringify(filtered));
        return new Response(JSON.stringify({ success: true, id, remaining: filtered.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Failed to delete" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
};
