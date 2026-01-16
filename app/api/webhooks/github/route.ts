import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = request.headers.get("x-github-event");
    if (event === "ping") {
      return NextResponse.json({ message: "pong" }, { status: 200 });
    }
    return NextResponse.json({ message: "Event Processes" }, { status: 200 });
  } catch (error) {
    console.error("Error processing GitHub webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
