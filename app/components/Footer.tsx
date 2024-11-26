import { Link } from "@remix-run/react";
import { Mail, Phone } from "lucide-react";

const FooterNew = () => {
  return (
    <footer className="px-4 lg:px-0">
      <div className="backdrop-blur-[2px] text-muted-foreground py-8 max-w-5xl  rounded-lg border border-border mb-4 mx-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-foreground font-inter-light mb-2">About Us</h3>
              <p className="text-sm">
                Your go-to platform for booking tickets to the hottest events.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground font-inter-light mb-2">Quick links</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <Link
                    to="/tickets"
                    className=" hover:text-primary transition-colors underline hover:no-underline"
                  >
                    Tickets
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className=" hover:text-primary transition-colors underline hover:no-underline"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className=" hover:text-primary transition-colors underline hover:no-underline"
                  >
                    Billing address
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground font-inter-light mb-2">
                Popular categories
              </h3>
              <ul className="text-sm space-y-1">
                <li>
                  <Link
                    to="#"
                    className=" hover:text-primary transition-colors underline hover:no-underline"
                  >
                    Conference
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className=" hover:text-primary transition-colors underline hover:no-underline"
                  >
                    Lecture
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className=" hover:text-primary transition-colors underline hover:no-underline"
                  >
                    All
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground font-inter-light mb-2">Contact</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center flex-wrap">
                  <Mail size={14} className="mr-2 flex-shrink-0" />
                  <a
                    href="mailto:info@ticketbooking.com"
                    className=" hover:text-primary transition-colors break-all"
                  >
                    info@ticketbooking.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone size={14} className="mr-2 flex-shrink-0" />
                  <a href="tel:+1234567890" className=" hover:text-primary transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm  mb-4 sm:mb-0">
              &copy; 2024 Ticket Booking. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/kh_aftabuddin" target="_blank">
                <Twiter className="w-4 hover:fill-primary transition-colors" />
              </a>
              <a href="https://www.linkedin.com/in/kh-aftab-uddin-ahmed/" target="_blank">
                <LinkedIn className="w-4 hover:fill-primary transition-colors" />
              </a>
              <a href="https://github.com/khaftab" target="_blank">
                <Github className="w-4 hover:fill-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;

const Twiter = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} fill="gray">
    <title>{"X"}</title>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const LinkedIn = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} fill="gray">
    <title>{"LinkedIn"}</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Github = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} fill="gray">
    <title>{"GitHub"}</title>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
