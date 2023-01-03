import { useState, useEffect} from "react";

export function useElementSize() {
    const [element, setElement] = useState(null);
    const [size, setSize] = useState({ width: null, height: null });
    useEffect(() => {
      if (element) {
        const { clientHeight, clientWidth } = element;
        setSize({ height: clientHeight, width: clientWidth });
      }
    }, [element]);
  
    return [size, setElement];
  }
  