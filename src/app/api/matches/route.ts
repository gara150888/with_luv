import { NextResponse } from "next/server"
import { getAllMatches, createMatch, updateMatch, deleteMatch } from "@/features/matches/actions"

export async function GET() {
  const result = await getAllMatches()

  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const result = await createMatch(body)

  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    )
  }
}

export async function PUT(request: Request) {
  const body = await request.json()
  if (!body.id) {
    return NextResponse.json(
      { success: false, message: "Match ID is required" },
      { status: 400 }
    )
  }
  const result = await updateMatch(body)

  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    )
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  if (!id) {
    return NextResponse.json(
      { success: false, message: "Match ID is required" },
      { status: 400 }
    )
  }
  const result = await deleteMatch(id)

  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    )
  }
}
