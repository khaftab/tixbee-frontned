import { ActionFunctionArgs, redirect } from "@remix-run/node";
import axios from "../config/axiosConfig";

export async function action({ request }: ActionFunctionArgs) {
  // Actions run on server-side. To delete cookie from client we need forward the respose from our backend to clinet.
  try {
    const response = await axios.get(`${process.env.HOST}/api/users/signout`, {
      headers: {
        Cookie: request.headers.get("Cookie") || "",
      },
    });
    /**  'set-cookie': [
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=none; secure; httponly'
    ] 
    */
    return redirect("/", {
      headers: {
        "Set-Cookie": Array.isArray(response.headers["set-cookie"])
          ? response.headers["set-cookie"][0]
          : "",
      },
    });
  } catch (error) {
    console.error(error);
  }
  return null;
}
