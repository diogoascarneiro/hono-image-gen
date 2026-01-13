// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";
import { AdvancedOptions as AdvancedOptionsComponent, type AdvancedOptions } from "./AdvancedOptions";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    negative_prompt: "",
    height: 1024,
    width: 1024,
    num_steps: 20,
    guidance: 7.5,
    seed: null,
  });

  // Cleanup object URL when component unmounts or imageUrl changes
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);

    // Revoke previous image URL if it exists
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }

    try {
      // Build request body with prompt and advanced options
      const requestBody: Record<string, unknown> = { prompt };

      // Only include advanced options if they have values
      if (advancedOptions.negative_prompt.trim()) {
        requestBody.negative_prompt = advancedOptions.negative_prompt;
      }
      if (advancedOptions.height !== 1024) {
        requestBody.height = advancedOptions.height;
      }
      if (advancedOptions.width !== 1024) {
        requestBody.width = advancedOptions.width;
      }
      if (advancedOptions.num_steps !== 20) {
        requestBody.num_steps = advancedOptions.num_steps;
      }
      if (advancedOptions.guidance !== 7.5) {
        requestBody.guidance = advancedOptions.guidance;
      }
      if (advancedOptions.seed !== null && advancedOptions.seed !== undefined) {
        requestBody.seed = advancedOptions.seed;
      }

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      // Create a blob URL from the image response
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleGenerate();
    }
  };

  return (
    <>
      <h1>AI Image Generator</h1>
      <div className="card">
        {imageUrl && !loading && (
          <div className="image-container">
            <img src={imageUrl} alt="Generated" className="generated-image" />
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating your image...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your image prompt..."
            disabled={loading}
            className="prompt-input"
          />
          <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="generate-button">
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <AdvancedOptionsComponent options={advancedOptions} onChange={setAdvancedOptions} disabled={loading} />
      </div>
    </>
  );
}

export default App;
