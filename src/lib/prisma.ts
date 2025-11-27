import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Handle connection cleanup gracefully
if (typeof window === "undefined") {
  const gracefulShutdown = async () => {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error("Error disconnecting Prisma:", error);
    }
  };

  process.on("beforeExit", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
}

export default prisma;

