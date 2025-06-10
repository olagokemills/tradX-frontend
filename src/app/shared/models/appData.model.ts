export interface RatingOption {
  rating: number;
  description: string;
  color: string;
}

export interface RatingScale {
  points: number;
  name: string;
  options: RatingOption[];
}
