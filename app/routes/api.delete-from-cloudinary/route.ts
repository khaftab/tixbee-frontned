import { ActionFunctionArgs, json } from "@remix-run/node";
import { cloudinary } from "~/config/cloudinaryConfig";
import { handleError } from "~/lib/handleError";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  const publicId = body.publicId as string;
  try {
    const result = await cloudinary.api.delete_resources([publicId], {
      resource_type: "image",
    });
    console.log(result);
    return json(result, { status: 200 });
  } catch (error) {
    handleError(error);
  }
}
