import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useActionData, useOutletContext } from "@remix-run/react";
import axios from "../config/axiosConfig";
import { OutletContext } from "~/types/types";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import NotSignedIn from "~/components/NotSignedIn";
import { validateAndSanitizeHTML } from "~/lib/validateAndSanitizeHTML";
import CreateNewTicketForm from "~/components/CreateNewTicketForm";
import { ticketSchema } from "~/lib/zodValidationSchema";
import { cloudinary } from "~/config/cloudinaryConfig";
import "react-quill/dist/quill.snow.css";

type Ticket = {
  title: string;
  price: string;
  category: string;
  thumbnailImagePublicId: string;
  ticketImagePublicId: string;
  description: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const schema = ticketSchema.omit({ thumbnail: true, ticket: true });

  const bodyObject: any = {};
  body.forEach((value, key) => {
    bodyObject[key] = value.toString();
  });

  const data: Ticket = {
    title: bodyObject.title,
    price: bodyObject.price,
    category: bodyObject.category,
    thumbnailImagePublicId: bodyObject.thumbnailImagePublicId,
    ticketImagePublicId: bodyObject.ticketImagePublicId,
    description: bodyObject.description,
  };

  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    return handleError(new Error("Validation failed in backend"));
  }

  const dirtyHtml = body.get("description") as string;

  const cleanHtml = validateAndSanitizeHTML(dirtyHtml);

  if (request.method === "PUT") {
    try {
      await axios.put(
        `${process.env.HOST}/api/tickets/${bodyObject.id}`,
        {
          ...data,
          description: cleanHtml,
        },
        {
          headers: {
            Cookie: request.headers.get("Cookie"),
          },
        }
      );
      // cloudinary.uploader.rename(bodyObject.imagePublicId, newPublicId, {
      //   overwrite: true,
      // });
      if (bodyObject.oldThumbnailImagePublicId) {
        cloudinary.api.delete_resources([bodyObject.oldImagePublicId], {
          resource_type: "image",
        });
      }
      if (bodyObject.oldTicketImagePublicId) {
        cloudinary.api.delete_resources([bodyObject.oldImagePublicId], {
          resource_type: "image",
        });
      }
      return redirect(`/tickets/${bodyObject.id}`);
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  } else if (request.method === "POST") {
    try {
      await axios.post(
        `${process.env.HOST}/api/tickets`,
        {
          ...data,
          description: cleanHtml,
        },
        {
          headers: {
            Cookie: request.headers.get("Cookie"),
          },
        }
      );
      // const res = cloudinary.uploader.rename(bodyObject.imagePublicId, newPublicId, {
      //   overwrite: true,
      // });

      return redirect(`/tickets`);
    } catch (error) {
      return handleError(error);
    }
  }
}

export default function CreateTicketRoute() {
  const actionData = useActionData<typeof action>();
  const { currentUser } = useOutletContext<OutletContext>();

  useToastError(actionData);

  if (!currentUser) {
    return <NotSignedIn />;
  }
  return <CreateNewTicketForm mode="create" />;
}
