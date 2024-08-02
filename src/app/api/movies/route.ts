// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { insertQuery, query } from "@/lib/db";
import { sendResponse, UPLOAD_DIR } from "@/lib/global";
import { type NextRequest } from "next/server";
import path from "path";
import fs from "fs";

/**
 * Retrieves a list of movies from the database based on the provided search parameters.
 *
 * @param {NextRequest} request - The request object containing the search parameters.
 * @return {Promise<NextResponse>} A promise that resolves to a NextResponse object with the movie list data or an error message.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = 8;
    const page = parseInt(searchParams.get("page") ?? "0");

    const offset = page * limit;
    

    const [rows, fields] = await query({
      query: "SELECT * FROM `movies` LIMIT ? OFFSET ?",
      values: [limit.toString(), offset.toString()],
    });

    const [count]: any = await query({
      query: "SELECT count(*) as count FROM `movies`",
      values: [limit.toString(), offset.toString()],
    });

    if (Array.isArray(rows) && rows.length > 0) {
      return sendResponse({
        message: "Movie List.",
        data: {
          rows,
          count: count[0].count
        },
      });
    } else {
      return sendResponse({
        status: 400,
        message: "User not found.",
      });
    }
  } catch (error: any) {
    return sendResponse({
      status: 500,
      message: "Something went wrong.",
      data: error
    });
  }
}

/**
 * Handles the POST request to save a movie.
 *
 * @param {Request} request - The request object containing the movie data.
 * @return {Promise<Response>} A promise that resolves to the response object.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const file = (body.image as Blob) || null;
    let newFilename = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      newFilename = `file_${Date.now()}${path.extname(
        (body.image as File).name || ""
      )}`;

      fs.writeFileSync(path.resolve(UPLOAD_DIR, newFilename), buffer);

      newFilename = `/uploads/${newFilename}`;
    }

    const payload = {
      title: body.title as string,
      publish_year: body.publish_year as string,
      image: newFilename,
    };

    const [result] = await insertQuery("movies", payload);

    return sendResponse({
      message: "Movie saved successfully.",
    });
  } catch (error: any) {
    return sendResponse({
      status: 500,
      message: "Something went wrong.",
    });
  }
}
