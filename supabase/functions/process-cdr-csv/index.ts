
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { parse } from 'https://deno.land/std@0.181.0/csv/parse.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

function parseDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  if (!isValidDate(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return new Date(dateStr).toISOString();
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

    const calls = records.map((record, index) => {
      try {
        // Add line number to error messages for better debugging
        const lineNumber = index + 2; // +2 because we skip header and array is 0-based
        
        // Validate required fields
        if (!record[0]) {
          throw new Error(`Line ${lineNumber}: caller_id is required`);
        }
        if (!record[1]) {
          throw new Error(`Line ${lineNumber}: callee_id is required`);
        }
        if (!record[2]) {
          throw new Error(`Line ${lineNumber}: start_time is required`);
        }
        
        let start_time: string | null;
        try {
          start_time = parseDate(record[2]);
          if (!start_time) {
            throw new Error(`Line ${lineNumber}: Invalid start_time`);
          }
        } catch (error) {
          throw new Error(`Line ${lineNumber}: Invalid start_time - ${error.message}`);
        }

        let end_time: string | null = null;
        if (record[3]) {
          try {
            end_time = parseDate(record[3]);
          } catch (error) {
            throw new Error(`Line ${lineNumber}: Invalid end_time - ${error.message}`);
          }
        }

        const call = {
          caller_id: record[0],
          callee_id: record[1],
          start_time,
          end_time,
          status: record[4] || 'completed',
          platform: record[5] || 'voip',
          call_type: record[6] || 'voice',
          geographic_location: record[7] || null,
          privacy_level: record[8] || 'public'
        };

        // Final validation of the object
        if (!call.caller_id || !call.callee_id || !call.start_time) {
          throw new Error(`Line ${lineNumber}: Missing required fields`);
        }

        return call;
      } catch (error) {
        throw new Error(`Error processing record: ${error.message}`);
      }
    });

    const { data, error } = await supabase
      .from('calls')
      .insert(calls)
      .select()

    if (error) {
      console.error('Database insertion error:', error);
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
    console.error('CSV processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process CSV', 
        details: error.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
