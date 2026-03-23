import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

// Check if smbls CLI is installed and user is logged in
async function checkSmblsStatus(): Promise<{ installed: boolean; loggedIn: boolean; error?: string }> {
  try {
    await execAsync("smbls --version");
  } catch {
    return { installed: false, loggedIn: false, error: "smbls CLI not installed. Run: npm i -g @symbo.ls/cli" };
  }

  try {
    const { stdout } = await execAsync("smbls login --check");
    const loggedIn = !stdout.toLowerCase().includes("not logged in") && !stdout.toLowerCase().includes("not authenticated");
    return { installed: true, loggedIn };
  } catch {
    return { installed: true, loggedIn: false };
  }
}

// GET - Check smbls CLI status
export async function GET() {
  try {
    const status = await checkSmblsStatus();
    return NextResponse.json(status);
  } catch (err) {
    return NextResponse.json(
      { installed: false, loggedIn: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST - Push project to Symbols platform
export async function POST(request: NextRequest) {
  try {
    const { projectName, action } = await request.json();

    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const projectDir = path.join(process.cwd(), "output", projectName);

    if (action === "login") {
      // Return login instructions - smbls login is interactive
      return NextResponse.json({
        message: "Run 'smbls login' in your terminal to authenticate with the Symbols platform.",
        command: "smbls login",
      });
    }

    if (action === "push") {
      const status = await checkSmblsStatus();

      if (!status.installed) {
        return NextResponse.json({
          error: "smbls CLI not installed",
          details: "Install it with: npm i -g @symbo.ls/cli",
        }, { status: 400 });
      }

      if (!status.loggedIn) {
        return NextResponse.json({
          error: "Not logged in to Symbols platform",
          details: "Run 'smbls login' in your terminal first",
        }, { status: 401 });
      }

      try {
        // Check if project is already linked (has symbols.json or .smbls config)
        let isLinked = false;
        try {
          await execAsync(`dir symbols.json`, { cwd: projectDir });
          isLinked = true;
        } catch {
          // Not linked yet
        }

        if (!isLinked) {
          // Create the project on the platform and link it
          try {
            const { stdout: createOutput } = await execAsync(
              `smbls project create ${projectName} --create-new`,
              { cwd: projectDir, timeout: 30000 }
            );
            return NextResponse.json({
              status: "created",
              message: "Project created and linked on Symbols platform",
              output: createOutput,
            });
          } catch (createErr) {
            // If create fails, try just pushing
            console.warn("Project create failed, attempting direct push:", createErr);
          }
        }

        // Push the project
        const { stdout, stderr } = await execAsync(
          "smbls push",
          { cwd: projectDir, timeout: 60000 }
        );

        // Try to determine the preview URL
        const previewUrl = `https://${projectName}.preview.symbo.ls/`;

        return NextResponse.json({
          status: "pushed",
          message: "Project pushed to Symbols platform successfully",
          output: stdout,
          warnings: stderr || undefined,
          previewUrl,
        });
      } catch (pushErr) {
        const errorMessage = pushErr instanceof Error ? pushErr.message : "Push failed";
        return NextResponse.json({
          error: "Failed to push project",
          details: errorMessage,
        }, { status: 500 });
      }
    }

    if (action === "status") {
      const status = await checkSmblsStatus();
      return NextResponse.json(status);
    }

    return NextResponse.json({ error: "Invalid action. Use: login, push, status" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
