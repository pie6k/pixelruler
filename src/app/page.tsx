"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { usePopper } from "react-popper";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #68b7e8 0%, #4373b8 100%);
  position: relative;
  cursor: crosshair;
`;

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const Controls = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 32px;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px 28px;
  z-index: 10;
  user-select: none;
`;

const SliderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
`;

const Value = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  min-width: 28px;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const Tooltip = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 6px;
  padding: 4px 8px;
  pointer-events: none;
  z-index: 20;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const Footer = styled.a`
  position: fixed;
  bottom: 10px;
  right: 14px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  z-index: 10;
  transition: color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.55);
  }
`;

const virtualReference = {
  getBoundingClientRect: () => new DOMRect(0, 0, 0, 0),
};

export default function Page() {
  const [spacing, setSpacing] = useState(64);
  const [subdivisions, setSubdivisions] = useState(4);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const virtualRef = useRef(virtualReference);
  const [tooltipEl, setTooltipEl] = useState<HTMLDivElement | null>(null);

  const { styles: popperStyles, attributes, update } = usePopper(
    virtualRef.current as unknown as HTMLElement,
    tooltipEl,
    {
      placement: "right-start",
      modifiers: [
        { name: "offset", options: { offset: [16, 16] } },
        { name: "flip", options: { fallbackPlacements: ["left-start", "right-end", "left-end"] } },
        {
          name: "preventOverflow",
          options: { boundary: wrapperRef.current ?? undefined, padding: 8 },
        },
      ],
    }
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Draw sub-lines
    if (subdivisions > 1) {
      const subSpacing = spacing / subdivisions;
      ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();

      for (let x = 0; x <= w; x += subSpacing) {
        // Skip positions that coincide with main lines
        if (Math.abs(x % spacing) < 0.01 || Math.abs((x % spacing) - spacing) < 0.01) continue;
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = 0; y <= h; y += subSpacing) {
        if (Math.abs(y % spacing) < 0.01 || Math.abs((y % spacing) - spacing) < 0.01) continue;
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }

      ctx.stroke();
    }

    // Draw main lines
    ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= w; x += spacing) {
      ctx.moveTo(Math.round(x) + 0.5, 0);
      ctx.lineTo(Math.round(x) + 0.5, h);
    }
    for (let y = 0; y <= h; y += spacing) {
      ctx.moveTo(0, Math.round(y) + 0.5);
      ctx.lineTo(w, Math.round(y) + 0.5);
    }

    ctx.stroke();
  }, [spacing, subdivisions]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMouse({ x: Math.round(x), y: Math.round(y) });

      virtualRef.current = {
        getBoundingClientRect: () => new DOMRect(e.clientX, e.clientY, 0, 0),
      };

      update?.();
    },
    [update]
  );

  const handleMouseLeave = useCallback(() => {
    setMouse(null);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Wrapper
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Canvas ref={canvasRef} />

        {mouse && (
          <Tooltip
            ref={setTooltipEl}
            style={popperStyles.popper}
            {...attributes.popper}
          >
            {mouse.x}, {mouse.y}
          </Tooltip>
        )}

        <Footer
          href="https://screen.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made at Screen Studio
        </Footer>

        <Controls>
          <SliderGroup>
            <Label>Spacing</Label>
            <SliderRow>
              <Slider
                type="range"
                min={16}
                max={256}
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
              />
              <Value>{spacing}</Value>
            </SliderRow>
          </SliderGroup>
          <SliderGroup>
            <Label>Subdivisions</Label>
            <SliderRow>
              <Slider
                type="range"
                min={1}
                max={12}
                value={subdivisions}
                onChange={(e) => setSubdivisions(Number(e.target.value))}
              />
              <Value>{subdivisions}</Value>
            </SliderRow>
          </SliderGroup>
        </Controls>
      </Wrapper>
    </>
  );
}
