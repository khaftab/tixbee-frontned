import { useActionData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import axios from "../config/axiosConfig";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import AuthForm from "~/components/AuthForm";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");
  try {
    const response = await axios.post(`${process.env.HOST}/api/users/signin`, {
      email,
      password,
    });
    return redirect("/", {
      headers: {
        "Set-Cookie": Array.isArray(response.headers["set-cookie"])
          ? response.headers["set-cookie"][0]
          : "",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export default function SigninRoute() {
  const actionData = useActionData<typeof action>();
  useToastError(actionData);

  return <AuthForm isSigninPage={true} />;
}
