import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.post("/api/generate-image", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, negative_prompt, height, width, num_steps, guidance, seed } = body;

    if (!prompt || typeof prompt !== "string") {
      return c.json({ error: "Prompt is required" }, 400);
    }

    // Build the options object for the AI model
    const options: {
      prompt: string;
      negative_prompt?: string;
      height?: number;
      width?: number;
      num_steps?: number;
      guidance?: number;
      seed?: number;
    } = {
      prompt: prompt,
    };

    // Add optional parameters if provided
    if (negative_prompt && typeof negative_prompt === "string") {
      options.negative_prompt = negative_prompt;
    }
    if (height && typeof height === "number" && height >= 256 && height <= 2048) {
      options.height = height;
    }
    if (width && typeof width === "number" && width >= 256 && width <= 2048) {
      options.width = width;
    }
    if (num_steps && typeof num_steps === "number" && num_steps >= 1 && num_steps <= 20) {
      options.num_steps = num_steps;
    }
    if (guidance && typeof guidance === "number" && guidance >= 0 && guidance <= 20) {
      options.guidance = guidance;
    }
    if (seed !== null && seed !== undefined && typeof seed === "number" && seed >= 0) {
      options.seed = seed;
    }

    const ai = c.env.AI;
    const imageStream = await ai.run("@cf/bytedance/stable-diffusion-xl-lightning", options);

    return new Response(imageStream, {
      headers: {
        "content-type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return c.json({ error: "Failed to generate image", details: String(error) }, 500);
  }
});

export default app;
