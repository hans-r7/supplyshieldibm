const apiKey = process.env.VITE_IBM_WATSONX_API_KEY;
const projectId = process.env.VITE_IBM_WATSONX_PROJECT_ID;

async function getIBMToken() {
  const response = await fetch(
    "https://iam.cloud.ibm.com/identity/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
    }
  );
  if (!response.ok) {
     console.error("Token fail:", await response.text());
     return null;
  }
  const data = await response.json();
  return data.access_token;
}

async function listModels() {
    const token = await getIBMToken();
    if (!token) return;
    console.log("Got token.");

    const url = `https://us-south.ml.cloud.ibm.com/ml/v1/foundation_model_specs?version=2023-05-29`;
    console.log("Fetching", url);
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        }
      }
    );
    if (!response.ok) {
        console.error("List models fail:", await response.text());
        return null;
    }
    const data = await response.json();
    const modelIds = data.resources.map(m => m.model_id);
    console.log("Available models:", JSON.stringify(modelIds, null, 2));
}

listModels();
