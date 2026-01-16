"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { deleteWebhook } from "@/module/github/lib/github";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { success } from "zod";

export const getUserProfile = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unathorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile");
    return null;
  }
};

export const updateUserProfile = async (data: {
  email?: string;
  name?: string;
}) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const updateUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    revalidatePath("/dashboard/settings", "page");
    return {
      success: true,
      user: updateUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
};

export const getConnectedRepositories = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unathorized");
    }
    const repositories = await prisma.repository.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return repositories;
  } catch (error) {
    console.error("Failed to fetch connected repositories from db");
    return [];
  }
};

export const disconnectRepository = async (repositoryId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unathorized");
    }
    const repository = await prisma.repository.findUnique({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });
    if (!repository) {
      throw new Error("Repository not found");
    }
   await Promise.all([
      deleteWebhook(repository.owner, repository.name),
      prisma.repository.delete({
        where: {
          id: repositoryId,
          userId: session.user.id,
        },
      }),
    ]);

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to disconnect repository");
    return { success: false, error: "Failed to disconnect repository" };
  }
};

export const disconnectAllRepositories = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unathorized");
    }
    const repositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    await Promise.all(
      repositories.map((repo) => {
        return deleteWebhook(repo.owner, repo.name);
      })
    );

    const result = await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error disconnect all repositories", error);
    return { success: false, error: "Error disconnect all repositories" };
  }
};
