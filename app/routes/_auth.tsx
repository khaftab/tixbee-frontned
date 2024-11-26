import { Outlet } from "@remix-run/react";
import DotPattern from "~/components/DotPattern";
import Navbar from "~/components/Navbar";
import { cn } from "~/lib/utils";

export default function Auth() {
  return (
    <div className="relative min-h-screen">
      {/* Dot Pattern Spread Across Entire Page */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn("absolute inset-0 w-full h-full")} // Ensures DotPattern covers the entire screen
      />
      <div className="relative min-h-screen flex flex-col justify-between z-10">
        <Navbar currentUser={null} />
        <Outlet />
        <div></div>
      </div>
    </div>
  );
}
