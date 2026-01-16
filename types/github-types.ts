import { components } from "@octokit/openapi-types";
export interface contributiondata {
  user: {
    contributionCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionCount: number;
          data: string | Date;
          color: string;
        }[];
      };
    };
  };
}

type GitHubRepo = components["schemas"]["repository"];

export type Repository = GitHubRepo & {
  isConnected: boolean;
};
