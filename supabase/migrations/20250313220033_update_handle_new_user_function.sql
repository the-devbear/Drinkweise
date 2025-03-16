set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
insert into public.users (id, username,profile_picture)
values (new.id, coalesce(nullif(new.raw_user_meta_data->>'name', ''), new.email),new.raw_user_meta_data->>'avatar_url');
return new;
end;$function$
;

comment on column public.users.height is 'Height in centimeters';
comment on column public.users.weight is 'Weight in kilograms';

