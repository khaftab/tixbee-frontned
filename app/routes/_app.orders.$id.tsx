import { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "~/config/axiosConfig";
import OrderView from "~/components/OrderView";
import { handleError } from "~/lib/handleError";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;
  try {
    const orderResponse = await axios.get(`${process.env.HOST}/api/orders/${id}`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });

    const userResponse = await axios.get(`${process.env.HOST}/api/users/user`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });

    return { order: orderResponse.data, user: userResponse.data };
  } catch (error: any) {
    console.log(error.response.data);
    return { order: null, user: null };
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const token = body.get("token");
  const orderId = body.get("orderId");
  const name = body.get("name");
  const address = body.get("address");
  const postalCode = body.get("postalCode");
  const city = body.get("city");
  const state = body.get("state");
  const country = body.get("country");

  let billingInfo = {};
  if (!name) {
    billingInfo = {
      name: "John Doe",
      line1: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: "94111",
    };
  } else {
    billingInfo = {
      name,
      line1: address,
      postal_code: postalCode,
      city,
      state,
      country,
    };
  }

  try {
    const response = await axios.post(
      `${process.env.HOST}/api/payments`,
      {
        token,
        orderId,
        billingInfo,
      },
      {
        headers: {
          Cookie: request.headers.get("Cookie"),
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    return handleError(error);
  }
}

export default function OrderRoute() {
  const { order, user } = useLoaderData<typeof loader>();

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <h2 className="text-2xl font-semibold">Order not found</h2>
      </div>
    );
  }

  return <OrderView order={order} user={user} />;
}
