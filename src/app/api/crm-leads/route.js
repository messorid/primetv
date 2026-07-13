// Server-side proxy to the Sistema Leads PrimeTV CRM's read-only lead feed.
// Keeps CRM_API_KEY out of the browser — the admin dashboard calls this
// route, which calls the CRM with the secret attached server-side.
export async function GET(request) {
  const isAuth = request.cookies.get("admin-auth")?.value;
  if (!isAuth) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.CRM_API_URL;
  const apiKey = process.env.CRM_API_KEY;

  if (!apiUrl || !apiKey) {
    return Response.json(
      { success: false, error: "CRM integration not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(apiUrl, {
      headers: { "X-API-Key": apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json(
        { success: false, error: `CRM returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return Response.json({ success: true, leads: data.leads });
  } catch (error) {
    console.error("Error fetching CRM leads", error);
    return Response.json({ success: false, error: "Failed to reach CRM" }, { status: 502 });
  }
}
