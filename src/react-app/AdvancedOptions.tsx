import { useState } from "react";
import { Tooltip } from "./Tooltip";

export interface AdvancedOptions {
  negative_prompt: string;
  height: number;
  width: number;
  num_steps: number;
  guidance: number;
  seed: number | null;
}

interface AdvancedOptionsProps {
  options: AdvancedOptions;
  onChange: (options: AdvancedOptions) => void;
  disabled?: boolean;
}

export function AdvancedOptions({ options, onChange, disabled = false }: AdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateOption = <K extends keyof AdvancedOptions>(key: K, value: AdvancedOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="advanced-options-container">
      <button type="button" className="accordion-header" onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
        <span>Advanced Options</span>
        <span className={`accordion-icon ${isOpen ? "open" : ""}`}>▼</span>
      </button>
      {isOpen && (
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
                value={options.negative_prompt}
                onChange={(e) => updateOption("negative_prompt", e.target.value)}
                placeholder="Elements to avoid..."
                disabled={disabled}
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
                value={options.height}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value >= 256 && value <= 2048) {
                    updateOption("height", value);
                  }
                }}
                disabled={disabled}
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
                value={options.width}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value >= 256 && value <= 2048) {
                    updateOption("width", value);
                  }
                }}
                disabled={disabled}
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
                value={options.num_steps}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value >= 1 && value <= 20) {
                    updateOption("num_steps", value);
                  }
                }}
                disabled={disabled}
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
                value={options.guidance}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 20) {
                    updateOption("guidance", value);
                  }
                }}
                disabled={disabled}
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
                value={options.seed ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
                  if (value === null || (!isNaN(value) && value >= 0)) {
                    updateOption("seed", value);
                  }
                }}
                placeholder="Random"
                disabled={disabled}
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
