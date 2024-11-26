import { ActionFunctionArgs, json } from "@remix-run/node";
import { cloudinary } from "~/config/cloudinaryConfig";

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "PUT") {
    console.log("PUT request received");

    return json({ public_id: null, context: null, status: 201 }, { status: 201 });
  }

  const body = await request.formData();
  const file = body.get("file") as File | null;
  const context = body.get("context") as string | null;
  const foldername = context === "ticket" ? "ticket-uploads" : "thumbnail-uploads";
  if (!file) {
    return json({ message: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: foldername },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });
    return json({ public_id: result.public_id, context: context, status: 201 }, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return json({ public_id: null, context: null, status: 500 }, { status: 500 });
  }
}
