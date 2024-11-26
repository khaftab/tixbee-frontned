import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "~/config/axiosConfig";
import CustomerOrderList from "~/components/CustomerOrderList";
import PaginationComponent from "~/components/Pagination";
import { handleError } from "~/lib/handleError";
import { useToastError } from "~/hooks/useToastError";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const sortBy = url.searchParams.get("sortBy") || "date";
  const filterBy = url.searchParams.get("filterBy") || "all";
  try {
    const orderResponse = await axios.get(
      `${process.env.HOST}/api/orders?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&filterBy=${filterBy}`,
      {
        headers: {
          Cookie: request.headers.get("Cookie"),
        },
      }
    );
    console.log(orderResponse.data.orders);
    return { orders: orderResponse.data.orders, totalOrders: orderResponse.data.totalOrders, page };
  } catch (error: any) {
    return handleError(error, { orders: [] });
  }
};

const ViewAllOrdersRoute = () => {
  const data = useLoaderData<typeof loader>();

  useToastError(data);
  console.log(data, "nog");

  return (
    <div className="my-14 px-4 lg:px-0">
      <CustomerOrderList orders={data.orders} totalOrders={data.totalOrders} />
      <PaginationComponent totalCount={data.totalOrders} page={data.page} />
    </div>
  );
};

export default ViewAllOrdersRoute;
