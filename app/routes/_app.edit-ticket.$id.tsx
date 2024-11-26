import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CreateNewTicketForm from "~/components/CreateNewTicketForm";
import axios from "~/config/axiosConfig";
import { handleError } from "~/lib/handleError";
import { TicketResult } from "~/types/types";
import "react-quill/dist/quill.snow.css";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;
  console.log("ID:", id);
  try {
    const response = await axios.get(`${process.env.HOST}/api/tickets/${id}`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });
    return { ticket: response.data as TicketResult };
  } catch (error: any) {
    return handleError(error);
  }
};

const EditTicketRoute = () => {
  const { ticket }: { ticket: TicketResult } = useLoaderData<typeof loader>();
  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <h2 className="text-2xl font-semibold">Ticket not found</h2>
      </div>
    );
  }
  return (
    <div>
      <CreateNewTicketForm mode="edit" ticket={ticket} />
    </div>
  );
};
export default EditTicketRoute;
