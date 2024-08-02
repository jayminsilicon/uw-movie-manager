// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query, updateQuery } from "@/lib/db";
import { sendResponse, UPLOAD_DIR } from "@/lib/global";
import { type NextRequest } from "next/server";
import path from "path";
import fs from "fs";

/**
 * Retrieves movie details by ID from the database and returns them as a response.
 *
 * @param {NextRequest} request - The request object containing the parameters.
 * @param {any} context - The context object containing the parameters.
 * @return {Promise<NextResponse>} A promise that resolves to a NextResponse object with the movie details or an error message.
 */
export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;    

    const [rows, fields] = await query({
      query: "SELECT * FROM `movies` WHERE id = ?",
      values: [id],
    });

    if (Array.isArray(rows) && rows.length > 0) {
      return sendResponse({
        message: "Movie details.",
        data: rows,
      });
    } else {
      return sendResponse({
        status: 400,
        message: "Movie not found.",
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
 * Updates a movie with the given ID in the database with the provided form data.
 *
 * @param {NextRequest} request - The request object containing the form data.
 * @param {any} context - The context object containing the ID of the movie to update.
 * @return {Promise<NextResponse>} A promise that resolves to a NextResponse object with a success message if the movie was updated successfully, or an error message if the movie was not found or an error occurred.
 */
export async function POST(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const file = (body.image as Blob) || null;
    let newFilename = null;

    if (file && typeof file !== "string") {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      newFilename = `file_${Date.now()}${path.extname(
        (body.image as File).name || ""
      )}`;

      fs.writeFileSync(path.resolve(UPLOAD_DIR, newFilename), buffer);

      newFilename = `/uploads/${newFilename}`;
    } else {
      newFilename = file;
    }

    const [rows] = await query({
      query: "SELECT * FROM `movies` WHERE id = ?",
      values: [id],
    });

    if (Array.isArray(rows) && rows.length > 0) {
      const payload = {
        title: body.title as string,
        publish_year: body.publish_year as string,
        image: newFilename,
      };

      const [result] = await updateQuery("movies", id, payload);

      return sendResponse({
        message: "Movie updated successfully.",
      });
    } else {
      return sendResponse({
        status: 400,
        message: "Movie not found.",
      });
    }
  } catch (error: any) {
    return sendResponse({
      status: 500,
      message: "Something went wrong.",
    });
  }
}
