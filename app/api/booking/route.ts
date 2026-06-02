// app/api/booking/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, workEmail, companyName, jobTitle, companyType, requirements } = body

    // Server-side validation fallback
    if (!fullName || !workEmail || !companyName || !jobTitle || !companyType || !requirements) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert directly into PostgreSQL using Prisma
    const newBooking = await db.booking.create({
      data: {
        fullName,
        workEmail,
        companyName,
        jobTitle,
        companyType,
        requirements,
      },
    })

    return NextResponse.json({ success: true, bookingId: newBooking.id }, { status: 201 })
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}