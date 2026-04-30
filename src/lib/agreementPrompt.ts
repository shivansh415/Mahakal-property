export interface AgreementFormData {
  landlordName: string
  landlordPhone: string
  landlordAadhaar?: string
  landlordAddress: string
  tenantName: string
  tenantPhone: string
  tenantAadhaar?: string
  tenantPermanentAddress: string
  propertyAddress: string
  monthlyRent: string
  securityDeposit: string
  startDate: string
  duration: string
  lockIn: string
  noticePeriod: string
  maintenance: string
  specialConditions?: string
}

// Models to try in order — 2.5-flash first (has best free-tier quota availability)
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
]

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function callGemini(apiKey: string, model: string, prompt: string): Promise<{ text?: string; error?: string; status: number }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  console.log(`[Gemini] Trying model: ${model}`)

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}`
    const errorStatus = data?.error?.status || 'UNKNOWN'
    console.error(`[Gemini] Model ${model} failed (${response.status} ${errorStatus}): ${errorMsg}`)
    return { error: errorMsg, status: response.status }
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    console.error(`[Gemini] Model ${model} returned no text. Response:`, JSON.stringify(data, null, 2))
    return { error: 'No text in response', status: 200 }
  }

  console.log(`[Gemini] Model ${model} succeeded. Generated ${text.length} chars.`)
  return { text, status: 200 }
}

export async function generateRentAgreement(data: AgreementFormData): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY

  console.log('[Gemini] API key exists:', !!apiKey)

  if (!apiKey) {
    console.error('[Gemini] GOOGLE_API_KEY is missing from .env.local')
    throw new Error('GOOGLE_API_KEY missing — add it to .env.local')
  }

  const prompt = `
You are an expert Indian property lawyer. Generate a complete, professional Rent Agreement 
in formal English following Indian rental law standards.

CRITICAL REQUIREMENT: Return ONLY plain text. Do NOT use markdown formatting. 
Do NOT use asterisks (*), hashtags (#), backticks, or JSON format.
Just plain readable text formatted with line breaks and numbering.

DETAILS:
Landlord: ${data.landlordName}, Phone: ${data.landlordPhone}, Address: ${data.landlordAddress}
${data.landlordAadhaar ? `Landlord Aadhaar: ${data.landlordAadhaar}` : ''}
Tenant: ${data.tenantName}, Phone: ${data.tenantPhone}, Address: ${data.tenantPermanentAddress}
${data.tenantAadhaar ? `Tenant Aadhaar: ${data.tenantAadhaar}` : ''}
Property Address: ${data.propertyAddress}
Monthly Rent: ₹${data.monthlyRent}
Security Deposit: ₹${data.securityDeposit}
Agreement Start: ${data.startDate}
Duration: ${data.duration}
Lock-in Period: ${data.lockIn}
Notice Period: ${data.noticePeriod}
Maintenance: ${data.maintenance}
Special Conditions: ${data.specialConditions || 'None'}

Generate a complete rent agreement with these sections:
1. Title and parties
2. Property description
3. Term and commencement
4. Rent and payment terms
5. Security deposit
6. Tenant obligations
7. Landlord obligations
8. Maintenance and repairs
9. Lock-in and notice period
10. Termination conditions
11. General conditions
12. Signature block for both parties

Use formal legal language. Include standard Indian rental clauses.
Make it complete and ready to print and sign.
`

  // Try each model in order
  let lastError = ''
  for (const model of GEMINI_MODELS) {
    // Allow up to 3 attempts per model (retry twice on 503 with increasing delay)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await callGemini(apiKey, model, prompt)

        if (result.text) {
          return result.text
        }

        // 503 = temporary overload — wait and retry SAME model
        if (result.status === 503 && attempt < 3) {
          const delay = attempt * 5000 // 5s, 10s
          console.log(`[Gemini] ${model} overloaded (503), retry #${attempt} in ${delay/1000}s...`)
          await sleep(delay)
          continue // retry same model
        }

        // If quota exhausted, try next model
        if (result.status === 429) {
          lastError = `${model}: Quota exhausted`
          console.log(`[Gemini] ${model} quota exhausted, trying next model...`)
          break // break inner loop, go to next model
        }

        // If model not found (retired), try next model
        if (result.status === 404) {
          lastError = `${model}: Model not found`
          console.log(`[Gemini] ${model} not found, trying next model...`)
          break
        }

        // Other error — move to next model
        lastError = result.error || 'Unknown error'
        break
      } catch (err: any) {
        lastError = err?.message || 'Network error'
        console.error(`[Gemini] ${model} threw exception:`, lastError)
        break
      }
    }
  }

  // All models failed
  console.error(`[Gemini] ALL models failed. Last error: ${lastError}`)

  // Return detailed fallback so user knows the exact issue
  return `RENT AGREEMENT (TEMPLATE)

This Rent Agreement is made on ${data.startDate || 'the date mentioned below'}.

BETWEEN

Landlord: ${data.landlordName}
Phone: ${data.landlordPhone}
Address: ${data.landlordAddress}
${data.landlordAadhaar ? `Aadhaar: ${data.landlordAadhaar}` : ''}

AND

Tenant: ${data.tenantName}
Phone: ${data.tenantPhone}
Permanent Address: ${data.tenantPermanentAddress}
${data.tenantAadhaar ? `Aadhaar: ${data.tenantAadhaar}` : ''}

PROPERTY: ${data.propertyAddress}

TERMS:
- Monthly Rent: Rs. ${data.monthlyRent}
- Security Deposit: Rs. ${data.securityDeposit}
- Duration: ${data.duration}
- Lock-in Period: ${data.lockIn}
- Notice Period: ${data.noticePeriod}
- Maintenance: ${data.maintenance}
${data.specialConditions ? `- Special Conditions: ${data.specialConditions}` : ''}

NOTE: This is a basic template generated because the AI service was temporarily unavailable (${lastError}). For a full AI-generated legal agreement, please try again later or generate a new API key at https://aistudio.google.com/apikey

Signature (Landlord): ___________________    Date: ___________

Signature (Tenant): ___________________     Date: ___________

Witness 1: ___________________

Witness 2: ___________________`
}
