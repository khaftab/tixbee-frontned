import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import axios from "../config/axiosConfig";
import TicketList from "~/components/TicketList";
import Loader from "~/components/Loader";
import PaginationComponent from "~/components/Pagination";
import SortAndFilter from "~/components/SortAndFilter";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const category = url.searchParams.get("category") || "conference";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const sortBy = url.searchParams.get("sortBy") || "date";
  const filterBy = url.searchParams.get("filterBy") || "all";

  try {
    const response = await axios.get(
      `${process.env.HOST}/api/tickets/category/${category}?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&filterBy=${filterBy}`,
      {
        headers: {
          Cookie: request.headers.get("Cookie"),
        },
      }
    );
    return {
      tickets: response.data.tickets,
      totalTickets: response.data.totalTickets as number,
      page,
    };
  } catch (error) {
    console.log(error);
  }
  return { tickets: [], totalTickets: 0, page };
}

export default function TicketsRoute() {
  const { tickets, totalTickets, page } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  console.log("tickets", tickets);
  const filterList = {
    mytickets: "My Tickets",
    all: "All Tickets",
  };

  return (
    <div className="max-w-5xl w-full mx-auto flex-1 grid sm:grid-cols-[1fr] relative justify-center my-7 space-y-5 sm:space-y-0">
      <div className="mb-7 mt-3 sm:sticky top-5 z-50 mr-10">
        <div>
          <SortAndFilter
            filterList={filterList}
            context="ticket"
            className="flex justify-center flex-wrap space-x-5 gap-y-3"
          />
        </div>
      </div>
      {navigation.state === "loading" ? (
        <Loader />
      ) : totalTickets === 0 ? (
        <div className="flex items-center justify-center absolute top-[65%] sm:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-xl font-semibold">No tickets available</h2>
        </div>
      ) : (
        <div className="">
          <TicketList tickets={tickets} />
          <PaginationComponent totalCount={totalTickets} page={page} />
        </div>
      )}
    </div>
  );
}
