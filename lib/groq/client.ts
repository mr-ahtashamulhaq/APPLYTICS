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
// GPT OSS 20B is a current production model with JSON and JSON-schema support,
// and its higher inference speed keeps resume generation responsive.
export const GROQ_MODEL = 'openai/gpt-oss-20b'
