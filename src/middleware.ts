import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Hi form middlware 👋");
}
