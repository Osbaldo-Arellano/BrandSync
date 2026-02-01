import { NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { supabase } from "@/lib/supabase";

const auth0 = new Auth0Client();

export async function GET() {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.sub;
  const { data, error } = await supabase
    .from("brands")
    .select("name, tagline, email, phone, logo_url")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? null);
}

export async function PUT(request: Request) {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.sub;
  const body = await request.json();
  const { name, tagline, email, phone, logo_url } = body;

  const { data, error } = await supabase
    .from("brands")
    .upsert(
      { user_id: userId, name, tagline, email, phone, logo_url, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
