
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CDRRecord {
  timestamp: string;
  sourceNumber?: string;
  destinationNumber?: string;
  duration?: number;
  callType?: string;
}

interface IPDRRecord {
  timestamp: string;
  sourceIP?: string;
  destinationIP?: string;
  protocol?: string;
  dataVolume?: number;
}

function validateCDRRecord(record: any): CDRRecord | null {
  if (!record.timestamp) {
    console.error("Missing required timestamp field");
    return null;
  }

  // Basic validation for timestamp format
  if (!Date.parse(record.timestamp)) {
    console.error("Invalid timestamp format");
    return null;
  }

  return {
    timestamp: record.timestamp,
    sourceNumber: record.sourceNumber || '',
    destinationNumber: record.destinationNumber || '',
    duration: Number(record.duration) || 0,
    callType: record.callType || 'unknown'
  };
}

function validateIPDRRecord(record: any): IPDRRecord | null {
  if (!record.timestamp) {
    console.error("Missing required timestamp field");
    return null;
  }

  // Basic validation for timestamp format
  if (!Date.parse(record.timestamp)) {
    console.error("Invalid timestamp format");
    return null;
  }

  return {
    timestamp: record.timestamp,
    sourceIP: record.sourceIP || '',
    destinationIP: record.destinationIP || '',
    protocol: record.protocol || '',
    dataVolume: Number(record.dataVolume) || 0
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recordType, records } = await req.json();
    
    if (!recordType || !records || !Array.isArray(records)) {
      throw new Error("Invalid request format. Expected recordType and records array.");
    }

    const validationResults = {
      valid: [] as (CDRRecord | IPDRRecord)[],
      invalid: [] as any[],
      summary: {
        totalRecords: records.length,
        validRecords: 0,
        invalidRecords: 0
      }
    };

    // Process each record based on type
    records.forEach((record: any) => {
      let validatedRecord = null;
      
      if (recordType.toLowerCase() === 'cdr') {
        validatedRecord = validateCDRRecord(record);
      } else if (recordType.toLowerCase() === 'ipdr') {
        validatedRecord = validateIPDRRecord(record);
      }

      if (validatedRecord) {
        validationResults.valid.push(validatedRecord);
        validationResults.summary.validRecords++;
      } else {
        validationResults.invalid.push(record);
        validationResults.summary.invalidRecords++;
      }
    });

    console.log(`Processed ${records.length} ${recordType} records. Valid: ${validationResults.summary.validRecords}, Invalid: ${validationResults.summary.invalidRecords}`);
    
    return new Response(
      JSON.stringify(validationResults),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: "Invalid request format",
        details: error.message
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        } 
      }
    );
  }
});
