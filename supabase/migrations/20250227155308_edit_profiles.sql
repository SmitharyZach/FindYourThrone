-- Add new columns to profiles table (examples - adjust these to your needs)
ALTER TABLE "public"."profiles"
    ADD COLUMN IF NOT EXISTS "email" text,
    DROP COLUMN IF EXISTS "website";


-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the updated function
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  insert into public.profiles (
    id, 
    email, 
    username
 )
  values (
    new.id, 
    new.raw_user_meta_data->>'email', 
    new.raw_user_meta_data->>'email'
  );
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();