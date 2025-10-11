import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  question: string;
}

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const huggingfaceApiKey = Deno.env.get("HUGGINGFACE_API_KEY");
    const modelName = Deno.env.get("HUGGINGFACE_MODEL_NAME");

    if (!huggingfaceApiKey || !modelName) {
      return new Response(
        JSON.stringify({ 
          error: "Missing Hugging Face configuration. Please set HUGGINGFACE_API_KEY and HUGGINGFACE_MODEL_NAME." 
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { question }: RequestPayload = await req.json();

    if (!question || question.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const huggingfaceUrl = `https://api-inference.huggingface.co/models/${modelName}`;

    const response = await fetch(huggingfaceUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${huggingfaceApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: question,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Hugging Face API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await response.json();
    
    let generatedText = "";
    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0].generated_text || result[0].text || "";
    } else if (typeof result === "object" && result.generated_text) {
      generatedText = result.generated_text;
    } else if (typeof result === "string") {
      generatedText = result;
    }

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        question: question
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in darija-generate function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
