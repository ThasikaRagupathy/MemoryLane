import { Mood } from "@/types/memory";

export const APP_NAME = "MemoryLane";
export const APP_TAGLINE = "Some moments deserve more than a camera roll.";
export const STORAGE_KEY = "memorylane:data:v1";

export interface MoodMeta {
  id: Mood;
  label: string;
  description: string;
  color: string;
  bgLight: string;
  border: string;
  text: string;
  dotColor: string;
}

export const MOODS: Record<Mood, MoodMeta> = {
  joyful: {
    id: "joyful",
    label: "Joyful",
    description: "Sunlit moments, bright laughter, and easy delights.",
    color: "#E5D49A",
    bgLight: "#FAF5E5",
    border: "#E0CCA0",
    text: "#7A6321",
    dotColor: "#D6BF72",
  },
  peaceful: {
    id: "peaceful",
    label: "Peaceful",
    description: "Still mornings, quiet rooms, and gentle breath.",
    color: "#777B5B",
    bgLight: "#EFF2E8",
    border: "#D3D9C4",
    text: "#464A32",
    dotColor: "#777B5B",
  },
  grateful: {
    id: "grateful",
    label: "Grateful",
    description: "Simple gifts, quiet help, and grounded warmth.",
    color: "#B86F54",
    bgLight: "#F8EDE7",
    border: "#E9CEC3",
    text: "#7B3F2B",
    dotColor: "#B86F54",
  },
  nostalgic: {
    id: "nostalgic",
    label: "Nostalgic",
    description: "Songs, scents, and places that bring back another time.",
    color: "#9C7A65",
    bgLight: "#F4EFEA",
    border: "#DBCFC7",
    text: "#5E4334",
    dotColor: "#9C7A65",
  },
  excited: {
    id: "excited",
    label: "Excited",
    description: "Anticipation, fresh starts, and fast heartbeats.",
    color: "#C2803D",
    bgLight: "#FBF3E8",
    border: "#E8D0B3",
    text: "#804E1D",
    dotColor: "#C2803D",
  },
  melancholy: {
    id: "melancholy",
    label: "Melancholy",
    description: "Tender aches, bittersweet endings, and rain on glass.",
    color: "#6B7C8E",
    bgLight: "#EFF2F5",
    border: "#CFD7DE",
    text: "#394856",
    dotColor: "#6B7C8E",
  },
  loved: {
    id: "loved",
    label: "Loved",
    description: "Warm hands, crowded dinners, and feeling held.",
    color: "#B05C6F",
    bgLight: "#F9ECEF",
    border: "#E8C2CA",
    text: "#7A3142",
    dotColor: "#B05C6F",
  },
  reflective: {
    id: "reflective",
    label: "Reflective",
    description: "Walking the long way home and taking note of the view.",
    color: "#687562",
    bgLight: "#EFF2EE",
    border: "#D2D9CE",
    text: "#3C4638",
    dotColor: "#687562",
  },
};

export const MOOD_LIST = Object.values(MOODS);
