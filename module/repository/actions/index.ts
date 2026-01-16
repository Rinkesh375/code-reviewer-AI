"use server" // if I comment this  and use this use client I will get the error why reason I need 
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { createWebhook, getRepositories } from "@/module/github/lib/github";
import { headers } from "next/headers";

export const fetchRepositories = async (
  page: number = 1,
  limit: number = 10
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  const githubRepos = await getRepositories(page, limit);

  const dbRepos = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedRepoIds = new Set(dbRepos.map((repo) => repo.githubId));
  return githubRepos.map((repo) => ({
    ...repo,
    isConnected: connectedRepoIds.has(BigInt(repo.id)),
  }));
};


export const connectRepository = async (owner: string, repo: string,githubId: number) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new Error("Unauthorized");
      }

      const webhook = await createWebhook(owner, repo);

      if(webhook){
        await prisma.repository.create({
          data:{
            githubId: BigInt(githubId),
            name: repo,
            owner,
            fullName: `${owner}/${repo}`,
            url: `https://github.com/${owner}/${repo}`,
            userId: session.user.id,
          }
        })
      }

      return webhook;
}
