// Gets a Bearer token from IBM IAM — call this before any watsonx API request
export async function getIBMToken() {
  const response = await fetch(
    "/api/ibm-iam/identity/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${import.meta.env.VITE_IBM_WATSONX_API_KEY}`,
    }
  );
  const data = await response.json();
  return data.access_token;
}
