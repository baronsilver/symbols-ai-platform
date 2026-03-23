import { NextRequest, NextResponse } from "next/server";

// Store preview HTML in memory (keyed by project name)
const previewStore = new Map<string, string>();

// POST - Store preview HTML for a project
export async function POST(request: NextRequest) {
  try {
    const { projectName, html } = await request.json();
    if (!projectName || !html) {
      return NextResponse.json({ error: "Missing projectName or html" }, { status: 400 });
    }
    previewStore.set(projectName, html);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET - Serve preview HTML for a project (returns raw HTML)
export async function GET(request: NextRequest) {
  const projectName = request.nextUrl.searchParams.get("project");
  if (!projectName) {
    return new NextResponse("Missing project parameter", { status: 400 });
  }

  const html = previewStore.get(projectName);
  if (!html) {
    return new NextResponse("<html><body><p>No preview available. Click Start Preview first.</p></body></html>", {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
