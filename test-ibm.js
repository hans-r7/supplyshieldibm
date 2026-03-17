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

async function testGenerate(urlPrefix) {
    const token = await getIBMToken();
    if (!token) return;
    console.log("Got token.");

    const url = `${urlPrefix}/ml/v1/text/generation?version=2023-05-29`;
    console.log("Fetching", url);
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: "ibm/granite-3-8b-instruct",
          input: "Hello, world",
          parameters: {
            max_new_tokens: 10,
          },
          project_id: projectId,
        }),
      }
    );
    if (!response.ok) {
        console.error("Generate fail:", await response.text());
        return null;
    }
    const data = await response.json();
    console.log("Generate success:", JSON.stringify(data, null, 2));
}

async function main() {
    console.log("Testing with env URL:");
    await testGenerate(process.env.VITE_IBM_WATSONX_URL);
    console.log("\nTesting with us-south URL:");
    await testGenerate("https://us-south.ml.cloud.ibm.com");
}
main();
