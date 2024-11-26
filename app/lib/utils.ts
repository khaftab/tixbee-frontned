import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateCloudinaryUrl = (publicId: string | undefined, transformations?: string) => {
  if (!publicId) {
    return "";
  }
  const cloudName = "dinoawbez";
  // const transformations = "ar_1.5,c_crop,w_100";
  if (!transformations) return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

export const ticketCategory = {
  conference: "Conference",
  lecture: "Lecture",
  workshop: "Workshop",
  auction: "Auction",
  concert: "Concert",
  theater: "Theater",
  other: "Other",
};
