import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // chatbot_data.txt is read at runtime by /api/chat. Without this, the file
  // is not traced into the serverless bundle and the chatbot loses its
  // knowledge base in production.
  outputFileTracingIncludes: {
    "/api/chat": ["./src/app/chatbot_data.txt"],
  },
};

export default nextConfig;
