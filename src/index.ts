import express from "express";
import cors from "cors";
import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Verificar si la API key está cargando
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "✔ Cargada" : "❌ VACÍA");

const openRouter = new OpenRouter({
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "MRV Backend",
  },
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message requerido" });
    }

    const completion = await openRouter.chat.send({
      model: "openai/gpt-oss-20b",   // <<=== MODELO GRATUITO
      max_tokens: 500,               // Seguro y barato
      messages: [
        { role: "user", content: message }
      ]
    });

    return res.json({
      response: completion.choices[0].message.content,
    });

  } catch (error: any) {
    console.error("Error OpenRouter:", error);

    return res.status(500).json({
      error: error.body ? error.body : "Error interno",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
