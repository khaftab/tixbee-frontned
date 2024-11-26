import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";

const NotSignedIn = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      <h1 className="text-3xl font-semibold mb-4">You are not signed in</h1>
      <p className="text-lg mb-8">Please sign in to continue</p>

      <Link to="/auth/signin">
        <Button className="px-6 py-2 rounded-md">Click here to Sign in</Button>
      </Link>
    </div>
  );
};

export default NotSignedIn;
