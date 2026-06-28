import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    test: {
      env,
      pool: 'forks',
      poolOptions: { forks: { singleFork: true } },
      setupFiles: ['dotenv/config'],   // ← agregar esto
    },
  };
});