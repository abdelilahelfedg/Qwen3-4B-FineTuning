interface GenerateRequest {
  question: string;
}

interface GenerateResponse {
  response: string;
  question: string;
  error?: string;
}

export async function generateDarijaResponse(question: string): Promise<GenerateResponse> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/darija-generate`;

  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ question } as GenerateRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return await response.json();
}
