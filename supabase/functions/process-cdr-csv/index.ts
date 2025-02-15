
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { parse } from 'https://deno.land/std@0.181.0/csv/parse.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const text = await file.text()
    const records = parse(text, { skipFirstRow: true })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const calls = records.map(record => ({
      caller_id: record[0],
      callee_id: record[1],
      start_time: new Date(record[2]).toISOString(),
      end_time: record[3] ? new Date(record[3]).toISOString() : null,
      status: record[4] || 'completed',
      platform: record[5] || 'voip',
      call_type: record[6] || 'voice',
      geographic_location: record[7] || null,
      privacy_level: record[8] || 'public'
    }))

    const { data, error } = await supabase
      .from('calls')
      .insert(calls)
      .select()

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to insert records', details: error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'CSV processed successfully', 
        recordsProcessed: calls.length,
        data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process CSV', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
