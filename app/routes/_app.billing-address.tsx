import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BillingForm from "~/components/BillingForm";
import NotSignedIn from "~/components/NotSignedIn";
import axios from "~/config/axiosConfig";
import { useToastError } from "~/hooks/useToastError";
import { handleError } from "~/lib/handleError";
import { ProfileSchema } from "~/lib/zodValidationSchema";
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const response = await axios.get(`${process.env.HOST}/api/users/user`, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });
    return { currentUser: response.data };
  } catch (error: any) {
    return handleError(error);
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const bodyObject: Record<string, string> = {};
  body.forEach((value, key) => {
    bodyObject[key] = value.toString();
  });

  const validationResult = ProfileSchema.safeParse(bodyObject);
  if (!validationResult.success) {
    return handleError(new Error("Validation failed in backend"));
  }

  try {
    const response = await axios.put(`${process.env.HOST}/api/users/update`, bodyObject, {
      headers: {
        Cookie: request.headers.get("Cookie"),
      },
    });
    console.log("Response:", response.data);
    return redirect("/tickets");
  } catch (error: any) {
    return handleError(error);
  }
}

const EditProfileRoute = () => {
  const data = useLoaderData<typeof loader>();

  useToastError(data);

  if (!data.currentUser) {
    return <NotSignedIn />;
  }
  return (
    <div>
      <BillingForm user={data.currentUser} />
    </div>
  );
};

export default EditProfileRoute;
