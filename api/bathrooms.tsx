import { supabase } from "@/lib/supabase";

export type Bathroom = {
  address: string;
  clean_rating: number;
  code?: string; // Made optional
  description: null | string;
  distance_meters: number;
  functional_rating: number;
  gender_neutral: boolean;
  google_place_id: null | string;
  id: string;
  is_accessible: boolean;
  is_operational?: boolean; // Made optional
  name: string;
  privacy_rating: number;
  rating_count: number;
  requires_key: boolean;
  requires_purchase: boolean;
  stocked_rating: number;
  lat: number;
  lng: number;
};

export interface BathroomReview {
  id: string;
  clean_rating: number | null;
  functional_rating: number | null;
  privacy_rating: number | null;
  stocked_rating: number | null;
  review_text?: string | null;
  created_at: string;
  profiles?: {
    username: string | null;
  };
}

export interface Feature {
  icon: string;
  label: string;
}

export interface BathroomData {
  name: string;
  address: string;
  rating: string;
  reviewCount: number;
  features: Feature[];
  description: string;
  distance: string;
  status: string;
}

// Get list of bathrooms with their average ratings
export async function getNearbyBathrooms({
  latitude,
  longitude,
  radiusMeters = 16093.4,
}: {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}) {
  const { data, error } = await supabase.rpc("nearby_bathrooms", {
    user_lat: latitude,
    user_lng: longitude,
    radius_meters: radiusMeters,
  });
  if (error) throw error;
  console.log("fetching new bathrooms from database");
  return data as Bathroom[];
}

// Get all ratings for a specific bathroom
export async function getBathroomRatings(bathroomId: string) {
  const { data, error } = await supabase
    .from("ratings")
    .select(
      `
        id,
        privacy_rating,
        functional_rating,
        stocked_rating,
        clean_rating,
        review_text,
        created_at,
        profiles (
          username
        )
      `
    )
    .eq("bathroom_id", bathroomId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
