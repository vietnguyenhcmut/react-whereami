import { useState, useEffect, useRef } from "react";
import { fetchSourceContent } from "../services/source-fetcher";
import { useDebounce } from "./useDebounce";
import type { SourceInfo, Position } from "../types";

interface HoverTarget {
  element: HTMLElement;
  event: MouseEvent;
}

export function useInspectorEvents(enabled: boolean) {
  const [source, setSource] = useState<SourceInfo | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [isPinned, setPinned] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<HoverTarget | null>(null);
  const debouncedHoverTarget = useDebounce(hoverTarget, 50);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      setHoverTarget(null);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isPinned) return;
      const target = event.target as HTMLElement;
      const sourceElement = target.closest(
        "[data-whereami-definition-file]"
      ) as HTMLElement;

      if (sourceElement) {
        setHoverTarget({ element: sourceElement, event });
      } else {
        setHoverTarget(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPinned, enabled]);

  useEffect(() => {
    if (!debouncedHoverTarget || isPinned || !enabled) return;

    const { element, event } = debouncedHoverTarget;

    if (element.dataset) {
      const definitionFile = element.dataset.whereamiDefinitionFile || "";
      const definitionAbsoluteFile =
        element.dataset.whereamiDefinitionAbsoluteFile || "";
      const usageFile = element.dataset.whereamiUsageFile || "";
      const usageLine = Number(element.dataset.whereamiUsageLine) || 0;
      const usageAbsoluteFile = element.dataset.whereamiUsageAbsoluteFile || "";

      if (
        definitionFile &&
        (!source || source.definitionFile !== definitionFile)
      ) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const tooltipMaxWidth = 600;
        const newPosition: Position = {};

        if (event.clientY > viewportHeight / 2) {
          newPosition.bottom = viewportHeight - event.clientY;
        } else {
          newPosition.top = event.clientY;
        }
        if (event.clientX + tooltipMaxWidth > viewportWidth) {
          newPosition.right = viewportWidth - event.clientX;
        } else {
          newPosition.left = event.clientX;
        }
        setPosition(newPosition);
        fetchSourceContent(
          definitionFile,
          definitionAbsoluteFile,
          usageFile,
          usageLine,
          usageAbsoluteFile,
          setSource
        );
      }
    }
  }, [debouncedHoverTarget, isPinned, source, enabled]);

  useEffect(() => {
    if (!enabled) {
      setSource(null);
      setPosition(null);
      return;
    }

    const handleMouseOut = (event: MouseEvent) => {
      if (isPinned) return;
      const relatedTarget = event.relatedTarget as Node;
      if (tooltipRef.current && !tooltipRef.current.contains(relatedTarget)) {
        setSource(null);
        setPosition(null);
        setHoverTarget(null);
      }
    };

    document.body.addEventListener("mouseout", handleMouseOut);
    return () => document.body.removeEventListener("mouseout", handleMouseOut);
  }, [isPinned, enabled]);

  return {
    source,
    setSource,
    position,
    setPosition,
    isPinned,
    setPinned,
    tooltipRef,
  };
}
