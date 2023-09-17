/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/views/**/*.hbs", "src/views/*.hbs"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
