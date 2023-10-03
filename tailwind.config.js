/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/views/**/*.hbs", "src/views/*.hbs", "src/public/js/*.js"],
  theme: {
    extend: {
      height: {
        "chat": "calc(100vh - 150px)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
