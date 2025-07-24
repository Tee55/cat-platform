import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { scanResultRouter } from "./routers/scan-result";
import { vulnerabilityRouter } from "./routers/vulnerability";
import { newsRouter } from "./routers/news";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  scanResult: scanResultRouter,
  vulnerability: vulnerabilityRouter,
  news: newsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
