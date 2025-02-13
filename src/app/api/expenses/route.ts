import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

async function authenticateUser() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "parthan@test.com",
    password: "Parthan@123",
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function GET() {
  const { data, error } = await supabase
    .from("expenses")
    .select("id, title, amount, type, created_at, categories(name,id)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const { title, amount, type, category: category_id } = await request.json();

  if (!title || !amount || !category_id) {
    return NextResponse.json(
      { error: "Title and amount are required" },
      { status: 400 }
    );
  }

  // 🔐 Authenticate the user
  try {
    await authenticateUser();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert([{ title, amount, type, category_id }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
