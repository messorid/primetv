// Server-side proxy to edit a lead's name on the Sistema Leads PrimeTV CRM.
// Keeps CRM_API_KEY out of the browser — the admin dashboard calls this
// route, which calls the CRM with the secret attached server-side.
export async function PATCH(request, { params }) {
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

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  if (!fullName) {
    return Response.json({ success: false, error: "fullName is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "PATCH",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ fullName }),
    });

    if (!res.ok) {
      return Response.json(
        { success: false, error: `CRM returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return Response.json({ success: true, lead: data });
  } catch (error) {
    console.error("Error updating CRM lead", error);
    return Response.json({ success: false, error: "Failed to reach CRM" }, { status: 502 });
  }
}
