import { NextRequest, NextResponse } from "next/server";

// Proxy requests to the local preview server
// GET /api/preview-proxy?project=X&path=/index.html -> proxies to http://127.0.0.1:PORT/index.html
export async function GET(request: NextRequest) {
  const projectName = request.nextUrl.searchParams.get("project");
  const requestPath = request.nextUrl.searchParams.get("path") || "/";

  if (!projectName) {
    return new NextResponse("Missing project parameter", { status: 400 });
  }

  // Get the server port from the preview-server API
  const statusRes = await fetch(`http://127.0.0.1:3000/api/preview-server?project=${encodeURIComponent(projectName)}`);
  if (!statusRes.ok) {
    return new NextResponse("Server not found", { status: 404 });
  }

  const statusData = await statusRes.json();
  if (!statusData.running) {
    return new NextResponse("Server not running", { status: 503 });
  }

  const port = statusData.port;
  const targetUrl = `http://127.0.0.1:${port}${requestPath}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "Accept": request.headers.get("Accept") || "*/*",
      },
    });

    const content = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(content, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse("Proxy error", { status: 502 });
  }
}
