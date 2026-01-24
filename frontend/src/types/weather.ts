export type ComfortRow = {
  city: { 
    id: string; 
    name: string 
  };
  weather: { 
    description: string; 
    tempC: number | null 
  };
  comfortScore: number | null;
  rank: number | null;
  cache?: { 
    raw?: "HIT" | "MISS" 
  };
};

export type ComfortResponse = {
  cache: { 
    processed: "HIT" | "MISS"; 
    ttlRemainingMs?: number 
  };
  result: ComfortRow[];
};