import { callEmbeddedMcpTool, getAvailableMcpTools, type McpToolDef } from "./embedded-mcp";

// Embedded client interface for compatibility
export class EmbeddedMcpClient {
  async listTools(): Promise<{ tools: McpToolDef[] }> {
    return { tools: getAvailableMcpTools() };
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<string> {
    return callEmbeddedMcpTool(name, args);
  }
}

let mcpClient: EmbeddedMcpClient | null = null;

export async function getMcpClient(): Promise<EmbeddedMcpClient> {
  if (mcpClient) return mcpClient;
  
  mcpClient = new EmbeddedMcpClient();
  console.log("[MCP] Embedded MCP client ready");
  
  return mcpClient;
}

export async function callMcpTool(
  toolName: string,
  args: Record<string, unknown> = {}
): Promise<string> {
  const client = await getMcpClient();
  const result = await client.callTool(toolName, args);
  return result;
}

export async function listMcpTools() {
  const client = await getMcpClient();
  const { tools } = await client.listTools();
  return tools.map((t) => ({
    name: t.name,
    description: t.description ?? "",
    inputSchema: t.inputSchema,
  }));
}

export async function disconnectMcp() {
  mcpClient = null;
}

export async function forceReconnectMcp() {
  console.log("[MCP] Force reconnecting...");
  await disconnectMcp();
  return getMcpClient();
}
