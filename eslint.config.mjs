import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
      "jsx-a11y/alt-text": "off", // 警告：缺少 alt 属性
      "no-console": "off", // 警告：禁止使用 console.log
      "@typescript-eslint/no-unused-vars": "off", // 警告：禁止使用未使用的变量
    },
  },
];

export default eslintConfig;
