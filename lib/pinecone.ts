import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_DB_API_KEY!,
});

export const pineconeindex = pinecone.index("code-review-ai-vector-embeddings");
