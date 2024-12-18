/** @type {import('@remix-run/dev').AppConfig} */
export default {
  tailwind: true,
  postcss: true,
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  env: {
    HOST: "http://ticket.dev",
    HOST1: process.env.HOST,
  },
};
