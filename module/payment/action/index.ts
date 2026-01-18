"use server";

import { auth } from "@/lib/auth";
import {
  getRemainingLimits,
  updateUserTier,
} from "@/module/payment/lib/subscription";
import { headers } from "next/headers";
import { polarClient } from "@/module/payment/config/polar";
import prisma from "@/lib/db";
import { constants } from "fs/promises";
import type { SubscriptionData } from "@/types/review-types";

export const getSubscriptionData = async (): Promise<SubscriptionData> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { user: null, limits: null };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { user: null, limits: null };
  }

  const limits = await getRemainingLimits(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      subscriptionTier: user.subscriptionTier || "FREE",
      subscriptionStatus: user.subscriptionStatus || null,
      polarCustomerId: user.polarCustomerId || null,
      polarSubscriptionId: user.polarSubscriptionId || null,
    },
    limits,
  };
};

export async function syncSubscriptionStatus() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.polarCustomerId) {
    return { success: false, message: "No Polar customer ID found" };
  }

  try {
    const result = await polarClient.subscriptions.list({
      customerId: user.polarCustomerId,
    });

    const subscriptions = result.result?.items || [];


    const activeSub = subscriptions.find((sub) => sub.status === "active");
    const latestSub = subscriptions[0]; 

    if (activeSub) {
      await updateUserTier(user.id, "PRO", "ACTIVE");
      return { success: true, status: "ACTIVE" };
    } else if (latestSub) {
      
      const status = latestSub.status === "canceled" ? "CANCELED" : "EXPIRED";

      if (latestSub.status !== "active") {
        await updateUserTier(user.id, "FREE", status);
      }
      return { success: true, status };
    }

    return { success: true, status: "NO_SUBSCRIPTION" };
  } catch (error) {
    console.error("Failed to sync subscription:", error);
    return { success: false, error: "Failed to sync with Polar" };
  }
}
