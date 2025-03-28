-- Enable PostGIS extension for geo data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Bathrooms table
CREATE TABLE IF NOT EXISTS "public"."bathrooms" (
  "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "name" text,
  "description" text,
  "location" geography(POINT) NOT NULL,  -- PostGIS geography type for lat/long
  "address" text,
  "code" text,
  "google_place_id" text,  -- NULL if user-added
  "added_by_user_id" uuid,  -- NULL if from Google Places
  "is_accessible" boolean DEFAULT false,
  "is_operational" boolean DEFAULT true,
  "key_required" boolean DEFAULT false,
  "attached_to_venue" boolean DEFAULT true,
  "gender_type" text,  -- 'male', 'female', 'gender-neutral', etc.
  "purchase_required" boolean DEFAULT true,
  "requires_key" boolean DEFAULT false,
  "requires_purchase" boolean DEFAULT false,
  "hours_of_operation" jsonb,  -- Store hours data as JSON
  CONSTRAINT "bathrooms_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bathrooms_google_place_id_key" UNIQUE ("google_place_id"),
  CONSTRAINT "bathrooms_added_by_user_id_fkey" FOREIGN KEY ("added_by_user_id") 
    REFERENCES "public"."profiles"("id") ON DELETE SET NULL
);

-- Create spatial index for faster geo queries
CREATE INDEX bathrooms_location_idx ON public.bathrooms USING GIST (location);

-- Ratings table
CREATE TABLE IF NOT EXISTS "public"."ratings" (
  "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "bathroom_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "overall_rating" smallint NOT NULL,
  "cleanliness_rating" smallint,
  "privacy_rating" smallint,
  "review_text" text,
  "is_verified_visit" boolean DEFAULT false,
  "visit_date" date,
  CONSTRAINT "ratings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ratings_bathroom_id_fkey" FOREIGN KEY ("bathroom_id") 
    REFERENCES "public"."bathrooms"("id") ON DELETE CASCADE,
  CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") 
    REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  CONSTRAINT "ratings_user_bathroom_unique" UNIQUE ("user_id", "bathroom_id"),
  CONSTRAINT "ratings_overall_range" CHECK (overall_rating BETWEEN 1 AND 5),
  CONSTRAINT "ratings_cleanliness_range" CHECK (cleanliness_rating BETWEEN 1 AND 5),
  CONSTRAINT "ratings_privacy_range" CHECK (privacy_rating BETWEEN 1 AND 5)
);

-- Bathroom photos table
CREATE TABLE IF NOT EXISTS "public"."bathroom_photos" (
  "id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "bathroom_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "photo_url" text NOT NULL,
  "caption" text,
  "is_approved" boolean DEFAULT false,
  CONSTRAINT "bathroom_photos_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bathroom_photos_bathroom_id_fkey" FOREIGN KEY ("bathroom_id") 
    REFERENCES "public"."bathrooms"("id") ON DELETE CASCADE,
  CONSTRAINT "bathroom_photos_user_id_fkey" FOREIGN KEY ("user_id") 
    REFERENCES "public"."profiles"("id") ON DELETE CASCADE
);

CREATE INDEX ratings_created_at_idx ON public.ratings(created_at);



-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER set_bathrooms_updated_at
BEFORE UPDATE ON public.bathrooms
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ratings_updated_at
BEFORE UPDATE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies for bathrooms
ALTER TABLE public.bathrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bathrooms are viewable by everyone" 
ON public.bathrooms FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own bathrooms" 
ON public.bathrooms FOR INSERT 
WITH CHECK (auth.uid() = added_by_user_id);

CREATE POLICY "Users can update their own bathrooms" 
ON public.bathrooms FOR UPDATE 
USING (auth.uid() = added_by_user_id);

-- RLS Policies for ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone" 
ON public.ratings FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own ratings" 
ON public.ratings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.ratings FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for bathroom photos
ALTER TABLE public.bathroom_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are viewable by everyone" 
ON public.bathroom_photos FOR SELECT 
USING (true);

CREATE POLICY "Users can upload their own photos" 
ON public.bathroom_photos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add additional indexes
CREATE INDEX ratings_bathroom_id_idx ON public.ratings(bathroom_id);
CREATE INDEX ratings_user_id_idx ON public.ratings(user_id);

-- Add DELETE policies
CREATE POLICY "Users can delete their own bathrooms" 
ON public.bathrooms FOR DELETE 
USING (auth.uid() = added_by_user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.ratings FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
ON public.bathroom_photos FOR DELETE 
USING (auth.uid() = user_id);

-- Create a function to calculate average ratings for a bathroom
CREATE OR REPLACE FUNCTION public.calculate_bathroom_average_ratings(bathroom_uuid uuid)
RETURNS TABLE (
  overall_avg numeric,
  cleanliness_avg numeric,
  privacy_avg numeric,
  rating_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(overall_rating)::numeric, 1) as overall_avg,
    ROUND(AVG(cleanliness_rating)::numeric, 1) as cleanliness_avg,
    ROUND(AVG(privacy_rating)::numeric, 1) as privacy_avg,
    COUNT(*) as rating_count
  FROM public.ratings
  WHERE bathroom_id = bathroom_uuid;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.nearby_bathrooms(
  lat double precision,
  lng double precision,
  radius_meters double precision default 1000
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  address text,
  google_place_id text,
  is_accessible boolean,
  gender_type text,
  is_free boolean,
  requires_key boolean,
  requires_purchase boolean,
  distance_meters double precision,
  overall_rating numeric,
  rating_count bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.description,
    b.address,
    b.google_place_id,
    b.is_accessible,
    b.gender_type,
    b.is_free,
    b.requires_key,
    b.requires_purchase,
    -- Calculate distance in meters
    ST_Distance(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_meters,
    -- Get average overall rating
    (SELECT overall_avg FROM public.calculate_bathroom_average_ratings(b.id)) as overall_rating,
    (SELECT rating_count FROM public.calculate_bathroom_average_ratings(b.id)) as rating_count
  FROM 
    public.bathrooms b
  WHERE 
    -- Filter bathrooms within the radius
    ST_DWithin(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_meters
    )
  ORDER BY
    distance_meters ASC;
END;
$$;

-- Create a second function that also includes the latest ratings
CREATE OR REPLACE FUNCTION public.nearby_bathrooms_with_ratings(
  lat double precision,
  lng double precision,
  radius_meters double precision default 1000,
  rating_limit integer default 3
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  address text,
  is_accessible boolean,
  gender_type text,
  is_free boolean,
  distance_meters double precision,
  overall_rating numeric,
  rating_count bigint,
  latest_ratings json
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.description,
    b.address,
    b.is_accessible,
    b.gender_type,
    b.is_free,
    -- Calculate distance in meters
    ST_Distance(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_meters,
    -- Get average overall rating
    (SELECT overall_avg FROM public.calculate_bathroom_average_ratings(b.id)) as overall_rating,
    (SELECT rating_count FROM public.calculate_bathroom_average_ratings(b.id)) as rating_count,
    -- Include the latest ratings as a JSON array
    (
      SELECT 
        json_agg(
          json_build_object(
            'id', r.id,
            'overall_rating', r.overall_rating,
            'cleanliness_rating', r.cleanliness_rating,
            'review_text', r.review_text,
            'created_at', r.created_at,
            'username', p.username
          )
        )
      FROM public.ratings r
      JOIN public.profiles p ON r.user_id = p.id
      WHERE r.bathroom_id = b.id
      ORDER BY r.created_at DESC
      LIMIT rating_limit
    ) as latest_ratings
  FROM 
    public.bathrooms b
  WHERE 
    -- Filter bathrooms within the radius
    ST_DWithin(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_meters
    )
  ORDER BY
    distance_meters ASC;
END;
$$;