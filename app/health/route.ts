/** Endpoint de validação da plataforma (Easypanel / Control Tower): https://thefedup.fbr.news/health */
export function GET() {
  return Response.json(
    { status: "ok", project: process.env.CONTROL_TOWER_PROJECT_ID ?? null, schema: process.env.CONTROL_TOWER_SCHEMA_NAME ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
