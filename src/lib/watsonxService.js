import { getIBMToken } from "./ibmAuth";

const PROJECT_ID = import.meta.env.VITE_IBM_WATSONX_PROJECT_ID;
const WATSONX_URL = import.meta.env.VITE_IBM_WATSONX_URL;

export async function scoreSupplierRisk(supplierName, eventDescription, region, setApiStatus) {
  const token = await getIBMToken();

  const prompt = `You are a semiconductor supply chain risk analyst.

Supplier: ${supplierName}
Region: ${region}
Event: ${eventDescription}

Score the risk to this supplier from 1 to 10 based on:
- Proximity to the event
- Severity of potential supply disruption
- How critical this supplier is to semiconductor production

Respond ONLY with a valid JSON object in this exact format:
{
  "supplier": "${supplierName}",
  "riskScore": <number 1-10>,
  "reasoning": "<one sentence explanation>",
  "recommendation": "<one concrete action to take>"
}`;

  try {
    setApiStatus && setApiStatus({ status: "pending", message: "Calling IBM API..." });
    const response = await fetch(
      "/api/watsonx/ml/v1/text/generation?version=2023-05-29",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: "ibm/granite-3-8b-instruct",
          input: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.2,
          },
          project_id: PROJECT_ID,
        }),
      }
    );

    if (!response.ok) {
      const failMsg = `[IBM API] Failure: ${response.status} ${response.statusText}`;
      setApiStatus && setApiStatus({ status: "error", message: failMsg });
      console.error(failMsg);
      return null;
    }

    const data = await response.json();
    const raw = data.results?.[0]?.generated_text || "{}";

    // Strip any text before/after the JSON object
    const startIndex = raw.indexOf('{');
    const endIndex = raw.lastIndexOf('}');
    
    let result = null;
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        try {
            const jsonStr = raw.substring(startIndex, endIndex + 1);
            result = JSON.parse(jsonStr);
        } catch (e) {
            console.error("[IBM API] Failed to parse extracted JSON:", e);
        }
    }
    setApiStatus && setApiStatus({ status: "success", message: "IBM API call succeeded." });
    console.log("[IBM API] Success:", result);
    return result;
  } catch (err) {
    setApiStatus && setApiStatus({ status: "error", message: `[IBM API] Error: ${err}` });
    console.error("[IBM API] Error:", err);
    return null;
  }
}
