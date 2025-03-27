/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary-color": "rgb(44, 41, 50)", // Gray
        "bg-secondary-color": "rgb(27, 25, 29)", // Slightly lighter gray
        "container-primary-color": "rgb(49, 46, 55)", // Gray
        "container-secondary-color": "rgb(41, 39, 44)", // Slightly lighter gray

        "even-color": "rgb(53, 51, 57)",
        "even-hover": "rgb(45, 43, 48)",
        "odd-color": "rgb(46, 44, 49)",
        "odd-hover": "rgb(42, 40, 45)",
        "selected-color": "rgb(74, 71, 78)",

        "text-color": "rgb(223, 223, 223)",
        "red-color": "rgb(225, 29, 72)", // Rose
        "red-hover": "rgb(190, 18, 60)",
        "red-active": "rgb(159, 18, 57)",
        "blue-color": "rgb(30, 73, 116)", // Aqua
        "blue-hover": "rgb(44, 79, 115)",
        "blue-active": "rgb(29, 64, 100)",
        "green-color": "rgb(34, 197, 94)", // Nice Green
        "green-hover": "rgb(22, 163, 74)",
        "green-active": "rgb(21, 128, 61)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
