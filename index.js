const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/stock", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "symbol query required" });
  try {
    const url = \`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=\${symbol}&apikey=\${process.env.ALPHA_API_KEY}\`;
    const r = await axios.get(url);
    const q = r.data["Global Quote"];
    if (!q || !q["05. price"]) {
      return res.status(500).json({ error: "Invalid response from Alpha Vantage" });
    }
    res.json({
      symbol,
      price: +q["05. price"],
      change: +q["09. change"],
      changePercent: +q["10. change percent"].replace("%",""),
      high: +q["03. high"],
      low: +q["04. low"],
      previousClose: +q["08. previous close"],
      volume: q["06. volume"]
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(\`Listening on port \${PORT}\`));
