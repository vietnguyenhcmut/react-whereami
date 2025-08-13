import type { SourceInfo } from "../types";

const fileContentCache = new Map<string, string>();

type SetSource = React.Dispatch<React.SetStateAction<SourceInfo | null>>;

export const fetchSourceContent = async (
  definitionFile: string,
  usageFile: string,
  usageLine: number,
  usageAbsoluteFile: string,
  setSource: SetSource
) => {
  const urlToFetch = `/__whereami_get_source?path=${encodeURIComponent(
    definitionFile
  )}`;

  if (fileContentCache.has(urlToFetch)) {
    setSource({
      definitionFile,
      usageFile,
      usageLine,
      usageAbsoluteFile,
      content: fileContentCache.get(urlToFetch)!,
      isLoading: false,
    });
    return;
  }
  setSource({
    definitionFile,
    usageFile,
    usageLine,
    usageAbsoluteFile,
    content: null,
    isLoading: true,
  });
  try {
    const res = await fetch(urlToFetch);
    if (res.ok) {
      const text = await res.text();
      fileContentCache.set(urlToFetch, text);
      setSource({
        definitionFile,
        usageFile,
        usageLine,
        usageAbsoluteFile,
        content: text,
        isLoading: false,
      });
    } else {
      throw new Error("Failed to fetch");
    }
  } catch (error) {
    console.error("Failed to fetch source:", error);
    setSource({
      definitionFile,
      usageFile,
      usageLine,
      usageAbsoluteFile,
      content: "Error: Cannot fetch source.",
      isLoading: false,
    });
  }
};
