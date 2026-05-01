// api/photo.js
// Proxies Google Places photo requests server-side so the API key
// never hits the browser and HTTP referrer restrictions work correctly.

export default async function handler(req, res) {
  const { ref, maxwidth = 600 } = req.query;

  if (!ref) {
    return res.status(400).json({ error: "Missing photo reference" });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // Decode in case it was URL-encoded by the browser
  const decodedRef = decodeURIComponent(ref);

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${encodeURIComponent(decodedRef)}&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "PartyOfTwo/1.0" }
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`Google photo API ${response.status}:`, text.slice(0, 200));
      return res.status(response.status).json({ error: "Google API error", status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Photo proxy error:", err);
    res.status(500).json({ error: "Proxy fetch failed", message: err.message });
  }
}
