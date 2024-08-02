// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sendResponse } from '@/lib/global'
 
/**
 * Retrieves a response message from the API.
 *
 * @return {Promise<Object>} A promise that resolves to an object containing a message property with the value "Api".
 */
export async function GET() {
  return sendResponse({message: "Api"})
}