import { useActionData } from "@remix-run/react";
import AuthForm from "~/components/AuthForm";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import axios from "../config/axiosConfig";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";

export async function action({ request }: ActionFunctionArgs) {
  console.log(process.env.HOST, "HOST");
  console.log(process.env.HOST1, "HOST1");

  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");
  try {
    const response = await axios.post(`${process.env.HOST}/api/users/signup`, {
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

export default function SignupRoute() {
  const actionData = useActionData<typeof action>();
  useToastError(actionData);

  return <AuthForm isSigninPage={false} />;
}
