import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import TicketQueue from "~/components/Queue";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  if (!process.env.HOST) {
    throw new Error("HOST is not defined in .env file");
  }
  return {
    HOST: process.env.HOST,
    ticketId: id,
  };
};

const QueueRoute = () => {
  const data = useLoaderData<typeof loader>();

  return <TicketQueue HOST={data.HOST} ticketId={data.ticketId} />;
};

export default QueueRoute;
