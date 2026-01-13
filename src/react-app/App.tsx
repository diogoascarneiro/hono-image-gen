// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";
import { Tooltip } from "./Tooltip";

interface AdvancedOptions {
  negative_prompt: string;
  height: number;
  width: number;
  num_steps: number;
  guidance: number;
  seed: number | null;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
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

        {/* Advanced Options Accordion */}
        <div className="advanced-options-container">
          <button
            type="button"
            className="accordion-header"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={loading}>
            <span>Advanced Options</span>
            <span className={`accordion-icon ${showAdvanced ? "open" : ""}`}>▼</span>
          </button>
          {showAdvanced && (
            <div className="accordion-content">
              <div className="advanced-options-grid">
                {/* Negative Prompt */}
                <div className="form-group">
                  <label className="form-label">
                    Negative Prompt
                    <Tooltip text="Text describing elements to avoid in the generated image">
                      <span className="tooltip-icon">ℹ️</span>
                    </Tooltip>
                  </label>
                  <input
                    type="text"
                    value={advancedOptions.negative_prompt}
                    onChange={(e) => setAdvancedOptions({ ...advancedOptions, negative_prompt: e.target.value })}
                    placeholder="Elements to avoid..."
                    disabled={loading}
                    className="form-input"
                  />
                </div>

                {/* Height */}
                <div className="form-group">
                  <label className="form-label">
                    Height
                    <Tooltip text="Image height in pixels (256-2048)">
                      <span className="tooltip-icon">ℹ️</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    min={256}
                    max={2048}
                    step={64}
                    value={advancedOptions.height}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 256 && value <= 2048) {
                        setAdvancedOptions({ ...advancedOptions, height: value });
                      }
                    }}
                    disabled={loading}
                    className="form-input"
                  />
                </div>

                {/* Width */}
                <div className="form-group">
                  <label className="form-label">
                    Width
                    <Tooltip text="Image width in pixels (256-2048)">
                      <span className="tooltip-icon">ℹ️</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    min={256}
                    max={2048}
                    step={64}
                    value={advancedOptions.width}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 256 && value <= 2048) {
                        setAdvancedOptions({ ...advancedOptions, width: value });
                      }
                    }}
                    disabled={loading}
                    className="form-input"
                  />
                </div>

                {/* Num Steps */}
                <div className="form-group">
                  <label className="form-label">
                    Steps
                    <Tooltip text="The number of diffusion steps; higher values can improve quality but take longer (default 20, max 20)">
                      <span className="tooltip-icon">ℹ️</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={advancedOptions.num_steps}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 1 && value <= 20) {
                        setAdvancedOptions({ ...advancedOptions, num_steps: value });
                      }
                    }}
                    disabled={loading}
                    className="form-input"
                  />
                </div>

                {/* Guidance */}
                <div className="form-group">
                  <label className="form-label">
                    Guidance
                    <Tooltip text="Controls how closely the generated image should adhere to the prompt; higher values make the image more aligned with the prompt (default 7.5)">
                      <span className="tooltip-icon">ℹ️</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.1}
                    value={advancedOptions.guidance}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 20) {
                        setAdvancedOptions({ ...advancedOptions, guidance: value });
                      }
                    }}
                    disabled={loading}
                    className="form-input"
                  />
                </div>

                {/* Seed */}
                <div className="form-group">
                  <label className="form-label">
                    Seed
                    <Tooltip text="Random seed for reproducibility of the image generation (leave empty for random)">
                      <span className="tooltip-icon">ℹ️</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    value={advancedOptions.seed ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
                      if (value === null || (!isNaN(value) && value >= 0)) {
                        setAdvancedOptions({ ...advancedOptions, seed: value });
                      }
                    }}
                    placeholder="Random"
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating your image...</p>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="image-container">
            <img src={imageUrl} alt="Generated" className="generated-image" />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
