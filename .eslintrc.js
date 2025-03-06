module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "react-hooks/exhaustive-deps": "warn", // Downgrade to warning
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "availableSpace|getSelectedPercentage",
        argsIgnorePattern: "^_",
      },
    ],
    "@next/next/no-img-element": "warn", // Downgrade to warning
  },
};
