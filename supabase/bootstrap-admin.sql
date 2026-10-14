insert into public.question_admins (user_id)
select id
from auth.users
where email = 'ADMIN_EMAIL'
on conflict (user_id) do nothing;
