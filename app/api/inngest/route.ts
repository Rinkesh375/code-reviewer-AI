import { inngest } from "@/inngest/client";
import { serve } from "inngest/next";
import { helloWorld } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});
