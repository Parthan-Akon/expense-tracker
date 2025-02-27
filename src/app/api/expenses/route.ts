import { USERS } from "@/app/constants";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface UserAuthObject {
  email: string;
  password: string;
}

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

async function authenticateUser(user: string) {
  const userObject: UserAuthObject = { email: "", password: "" };
  if (user === "parthan") {
    userObject.email = USERS.PARTHAN.email;
    userObject.password = USERS.PARTHAN.password;
  } else if (user === "anjaly") {
    userObject.email = USERS.ANJALY.email;
    userObject.password = USERS.ANJALY.password;
  }

  const { data, error } = await supabase.auth.signInWithPassword(userObject);
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
  const {
    title,
    amount,
    type,
    category: category_id,
    user,
  } = await request.json();

  if (!title || !amount || !category_id) {
    return NextResponse.json(
      { error: "Title and amount are required" },
      { status: 400 }
    );
  }

  // 🔐 Authenticate the user
  let authenticatedUser;
  try {
    authenticatedUser = await authenticateUser(user);
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
    .insert([
      { title, amount, type, category_id, user: authenticatedUser.user.email },
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
