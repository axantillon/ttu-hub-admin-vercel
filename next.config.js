// @ts-check

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  // Your Next.js config
  images: {
    loader: "custom",
    loaderFile: "./src/lib/utils/imageLoader.ts",
  },
});