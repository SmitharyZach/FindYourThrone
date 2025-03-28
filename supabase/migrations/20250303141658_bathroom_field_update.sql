ALTER TABLE "public"."bathrooms"
    ADD COLUMN IF NOT EXISTS "gender_neutral" boolean DEFAULT false,
    DROP COLUMN "gender_type",
    DROP COLUMN "purchase_required",
    DROP COLUMN "key_required";
-- Step 1: Drop existing constraints
ALTER TABLE "public"."ratings" 
  DROP CONSTRAINT IF EXISTS "ratings_overall_range",
  DROP CONSTRAINT IF EXISTS "ratings_cleanliness_range",
  DROP CONSTRAINT IF EXISTS "ratings_privacy_range";

-- Step 2: Change column data types and add new rating columns
ALTER TABLE "public"."ratings"
  DROP COLUMN IF EXISTS "overall_rating",
  DROP COLUMN IF EXISTS "cleanliness_rating",
  DROP COLUMN IF EXISTS "privacy_rating",
  ADD COLUMN "privacy_rating" numeric(2,1),
  ADD COLUMN "functional_rating" numeric(2,1),
  ADD COLUMN "stocked_rating" numeric(2,1),
  ADD COLUMN "clean_rating" numeric(2,1);


-- Drop existing functions before recreating them
DROP FUNCTION IF EXISTS public.calculate_bathroom_average_ratings(uuid);
DROP FUNCTION IF EXISTS public.nearby_bathrooms(double precision, double precision, double precision);
DROP FUNCTION IF EXISTS public.nearby_bathrooms_with_ratings(double precision, double precision, double precision, integer);

-- Create the updated calculate_bathroom_average_ratings function
CREATE FUNCTION public.calculate_bathroom_average_ratings(bathroom_uuid uuid)
RETURNS TABLE (
  privacy_avg numeric,
  functional_avg numeric,
  stocked_avg numeric,
  clean_avg numeric,
  rating_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(privacy_rating)::numeric, 1) as privacy_avg,
    ROUND(AVG(functional_rating)::numeric, 1) as functional_avg,
    ROUND(AVG(stocked_rating)::numeric, 1) as stocked_avg,
    ROUND(AVG(clean_rating)::numeric, 1) as clean_avg,
    COUNT(*) as rating_count
  FROM public.ratings
  WHERE bathroom_id = bathroom_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create the updated nearby_bathrooms function
CREATE FUNCTION public.nearby_bathrooms(
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
  gender_neutral boolean,
  is_free boolean,
  requires_key boolean,
  requires_purchase boolean,
  distance_meters double precision,
  privacy_rating numeric,
  functional_rating numeric,
  stocked_rating numeric,
  clean_rating numeric,
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
    b.gender_neutral,
    b.is_free,
    b.requires_key,
    b.requires_purchase,
    ST_Distance(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_meters,
    (SELECT privacy_avg FROM public.calculate_bathroom_average_ratings(b.id)) as privacy_rating,
    (SELECT functional_avg FROM public.calculate_bathroom_average_ratings(b.id)) as functional_rating,
    (SELECT stocked_avg FROM public.calculate_bathroom_average_ratings(b.id)) as stocked_rating,
    (SELECT clean_avg FROM public.calculate_bathroom_average_ratings(b.id)) as clean_rating,
    (SELECT rating_count FROM public.calculate_bathroom_average_ratings(b.id)) as rating_count
  FROM 
    public.bathrooms b
  WHERE 
    ST_DWithin(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_meters
    )
  ORDER BY
    distance_meters ASC;
END;
$$;

-- Create the updated nearby_bathrooms_with_ratings function
CREATE FUNCTION public.nearby_bathrooms_with_ratings(
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
  gender_neutral boolean,
  is_free boolean,
  distance_meters double precision,
  privacy_rating numeric,
  functional_rating numeric,
  stocked_rating numeric,
  clean_rating numeric,
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
    b.gender_neutral,
    b.is_free,
    ST_Distance(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance_meters,
    (SELECT privacy_avg FROM public.calculate_bathroom_average_ratings(b.id)) as privacy_rating,
    (SELECT functional_avg FROM public.calculate_bathroom_average_ratings(b.id)) as functional_rating,
    (SELECT stocked_avg FROM public.calculate_bathroom_average_ratings(b.id)) as stocked_rating,
    (SELECT clean_avg FROM public.calculate_bathroom_average_ratings(b.id)) as clean_rating,
    (SELECT rating_count FROM public.calculate_bathroom_average_ratings(b.id)) as rating_count,
    (
      SELECT 
        json_agg(
          json_build_object(
            'id', r.id,
            'privacy_rating', r.privacy_rating,
            'functional_rating', r.functional_rating,
            'stocked_rating', r.stocked_rating,
            'clean_rating', r.clean_rating,
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
    ST_DWithin(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_meters
    )
  ORDER BY
    distance_meters ASC;
END;
$$;