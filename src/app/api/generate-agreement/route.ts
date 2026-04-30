import { generateRentAgreement } from '@/lib/agreementPrompt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Incoming data:", body)

    if (!body) {
      return Response.json({ success: false, error: "No data received" }, { status: 400 })
    }

    const agreement = await generateRentAgreement(body)

    return Response.json({
      success: true,
      agreement
    })
  } catch (error: any) {
    console.error("API ERROR:", error)

    return Response.json({
      success: false,
      error: error?.message || "Internal Server Error"
    }, { status: 500 })
  }
}
