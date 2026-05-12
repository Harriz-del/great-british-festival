import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://modvsohippujbuhrqumn.supabase.co'.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseKey = 'sb_publishable_t7Jf1bziZIq8txP5_OJixw_r2d-kHCz';

export const supabase = createClient(supabaseUrl, supabaseKey);
