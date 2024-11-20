import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname + "/lib/main.ts"),
      formats: ["es"],
    },
  },
  plugins: [dts({ include: ["lib"] })],
});
