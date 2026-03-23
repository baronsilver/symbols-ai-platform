import { NextRequest, NextResponse } from "next/server";
import { runningServers } from "../preview-server/route";

// Proxy requests to the local preview server
// GET /api/preview-proxy?project=X&path=/index.html -> proxies to http://127.0.0.1:PORT/index.html
export async function GET(request: NextRequest) {
  const projectName = request.nextUrl.searchParams.get("project");
  const requestPath = request.nextUrl.searchParams.get("path") || "/";

  if (!projectName) {
    return new NextResponse("Missing project parameter", { status: 400 });
  }

  // Get the server port from the in-memory map
  const serverInfo = runningServers.get(projectName);
  if (!serverInfo) {
    return new NextResponse("Server not running. Click Start Preview first.", { status: 503 });
  }

  const port = serverInfo.port;
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
    return new NextResponse("Proxy error: " + (err instanceof Error ? err.message : String(err)), { status: 502 });
  }
}
