import { GetProp, notification, UploadFile, UploadProps } from "antd";
import { ArgsProps } from "antd/es/notification";
import { NextResponse } from "next/server";
import path from "path";


export interface Response {
  status?: number;
  message: string;
  data?: any;
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export type MovieFieldType = {
  title: string;
  publish_year: string;
  image: any;
};

export const UPLOAD_DIR = path.resolve("public/uploads");

/**
 * Sends a JSON response with the provided status, message, and data.
 *
 * @param {Object} options - An object containing the following properties:
 *   @param {number} [status=200] - The HTTP status code of the response.
 *   @param {string} message - The message to be included in the response.
 *   @param {any} data - The data to be included in the response.
 * @return {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
export const sendResponse = ({ status=200, message, data }: Response) => {
  return NextResponse.json(
    {
      message,
      data,
    },
    {
      status: status,
    }
  );
};

/**
 * We use notification from here 2 type of nofiifcation
 * Success: {placement:"bottomRight",message: "Your Success message"}
 * Error: {placement:"bottomRight",message: "Your Error Message"}
 */
export const Notification = {
  success: (data: ArgsProps) => {
    notification.success({
      placement: data.placement ? data.placement : "bottomRight",
      duration: 3,
      ...data,
    });
  },
  error: (data: ArgsProps) => {
    notification.error({
      placement: data.placement ? data.placement : "bottomRight",
      duration: 3,
      ...data,
    });
  },
};

/**
 * Opens a new window and displays the image file specified in the given `UploadFile` object.
 *
 * @param {UploadFile} file - The `UploadFile` object containing the image file.
 * @return {Promise<void>} A Promise that resolves when the image is displayed in the new window.
 */
export const onPreview = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as FileType);
      reader.onload = () => resolve(reader.result as string);
    });
  }
  const image = new (Image as any)();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};
