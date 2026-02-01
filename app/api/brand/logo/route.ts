import { NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { supabase } from "@/lib/supabase";

const auth0 = new Auth0Client();

export async function POST(request: Request) {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.sub.replace(/\|/g, "_");
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/logo.${ext}`;

  const { error } = await supabase.storage
    .from("logos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from("logos").getPublicUrl(path);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}

export async function DELETE() {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.sub.replace(/\|/g, "_");

  // List files in user's folder to find the logo regardless of extension
  const { data: files } = await supabase.storage.from("logos").list(userId);

  if (files && files.length > 0) {
    const paths = files.map((f) => `${userId}/${f.name}`);
    await supabase.storage.from("logos").remove(paths);
  }

  return NextResponse.json({ ok: true });
}
