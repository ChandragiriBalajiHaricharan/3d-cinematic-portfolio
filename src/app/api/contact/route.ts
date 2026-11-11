import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // ---------------------
    // OPTION A: Log to console (default — works without DB)
    // ---------------------
    console.log("📬 New contact form submission:", { name, email, message });

    // ---------------------
    // OPTION B: Save to Neon (Postgres) — uncomment when ready
    // ---------------------
    // import { neon } from "@neondatabase/serverless";
    // const sql = neon(process.env.DATABASE_URL!);
    // await sql`
    //   INSERT INTO contacts (name, email, message, created_at)
    //   VALUES (${name}, ${email}, ${message}, NOW())
    // `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

