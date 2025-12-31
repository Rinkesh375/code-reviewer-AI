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
