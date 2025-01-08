export interface SentimentData {
    platform: string;
    text: string;
    year: number;
    sentiment: {
      compound: number;
      neg: number;
      neu: number;
      pos: number;
    };
    mental_health: {
      label: string;
      score: number;
    }[];
  }
  