import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://cjoxvncdmlhnfrybeqss.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqb3h2bmNkbWxobmZyeWJlcXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTczMjIsImV4cCI6MjA5MTkzMzMyMn0.DsImP_z4j03irRWrPYYDHxVK_33rYMV7Meqo4-yZmVQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
