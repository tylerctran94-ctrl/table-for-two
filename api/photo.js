// api/photo.js
// Proxies Google Places photo requests server-side so the API key
// never hits the browser and HTTP referrer restrictions work correctly.

export default async function handler(req, res) {
  const { ref, maxwidth = 600 } = req.query;

  if (!ref) {
    return res.status(400).json({ error: "Missing photo reference" });
  }

  // Sanitize — only allow valid base64-ish photo reference strings
  if (!/^[A-Za-z0-9_\-]+$/.test(ref)) {
    return res.status(400).json({ error: "Invalid photo reference" });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${ref}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Google API error" });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    // Cache aggressively — photo refs don't change
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Photo proxy error:", err);
    res.status(500).json({ error: "Proxy fetch failed" });
  }
}
