const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/logs", async (req, res) => {
  const { serviceId, apiKey, ownerId, limit = 100 } = req.query;

  if (!serviceId || !apiKey || !ownerId) {
    return res
      .status(400)
      .json({ error: "serviceId, ownerId and apiKey are required" });
  }

  const url = `https://api.render.com/v1/logs?ownerId=${encodeURIComponent(ownerId)}&resource=${encodeURIComponent(serviceId)}&limit=${limit}&direction=backward`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res
        .status(response.status)
        .json({ error: `Render API error: ${errText}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
