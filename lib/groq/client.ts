import Groq from 'groq-sdk'

let client: Groq | null = null

export function getGroqClient() {
  if (client) return client

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('Missing required server environment variable: GROQ_API_KEY')

  client = new Groq({ apiKey })
  return client
}

// Groq retired llama-3.3-70b-versatile for free and developer-tier usage.
// GPT OSS 120B is the current production replacement for this workload.
export const GROQ_MODEL = 'openai/gpt-oss-120b'
