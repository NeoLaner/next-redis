import { getUserData } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paramsSchema = z.object({
  userId: z.string(),
});
// ...existing code...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const validatedParams = paramsSchema.parse(await params);
    const data = await getUserData(validatedParams.userId);
    if (data) return Response.json(data);
    return Response.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  return NextResponse.json("ok");
}

// ...existing code...
