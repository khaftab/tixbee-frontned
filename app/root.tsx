import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import "./tailwind.css";
import { Toaster } from "~/components/ui/toaster";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useSystemTheme } from "./hooks/useSystemTheme";
import ErrorPage from "./components/ErrorPage";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return { theme: null };
  let theme = cookieHeader.split(";").find((cookie) => cookie.trim().startsWith("theme="));
  if (!theme) return { theme: null };
  theme = theme.split("=")[1];
  return {
    theme,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const systemTheme = useSystemTheme();

  return (
    <html lang="en" data-theme={data?.theme ?? systemTheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden">
        <Toaster />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <ErrorPage />;
}
