set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.complete_drink_session(name text, start_time timestamp with time zone, end_time timestamp with time zone, consumptions jsonb, note text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  drink_session_id UUID;
BEGIN
  -- Create the drink session record
  INSERT INTO public.drink_sessions
    (name, note, start_time, end_time, user_id)
  VALUES
    (name, note, start_time, end_time, auth.uid())
  RETURNING id INTO drink_session_id;
  
  -- Process each consumption from the JSON array
INSERT INTO public.consumptions
    (drink_id, drink_session_id, start_time, end_time, volume)
SELECT
    (consumption->>'drink_id')::UUID,
    drink_session_id,
    (consumption->>'start_time')::TIMESTAMPTZ,
    (consumption->>'end_time')::TIMESTAMPTZ,
    (consumption->>'volume')::BIGINT
FROM jsonb_array_elements(consumptions) AS consumption;
  
  -- Return the created drink session ID
  RETURN drink_session_id;
END;
$function$
;


REVOKE EXECUTE ON FUNCTION public.complete_drink_session FROM public, anon;

-- Add comment to function
COMMENT ON FUNCTION public.complete_drink_session IS 'Saves a drink session with all its consumptions to the database';

