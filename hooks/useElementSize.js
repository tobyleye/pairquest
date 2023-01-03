import { useState, useEffect, useMemo } from "react";

export function useElementSize() {
  const [element, setElement] = useState(null);
  const [size, setSize] = useState({ width: null, height: null });

  const observer = useMemo(
    () =>
      new window.ResizeObserver((entries) => {
        if (entries[0]) {
          const { clientHeight, clientWidth } = entries[0].target;
          setSize({
            width: clientWidth,
            height: clientHeight,
          });
        }
      }),
    []
  );

  useEffect(() => {
    if (element) {
      const { clientHeight, clientWidth } = element;
      setSize({ height: clientHeight, width: clientWidth });
    }
  }, [element]);

  useEffect(() => {
    if (!element) return;
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element, observer]);


  return [size, setElement];
}
