import { useState } from "react";
import { SwapRequest } from "@/types/schedule";
import { INITIAL_SWAPS } from "./swap.data";

export function useSwaps() {
  const [swaps, setSwaps] = useState<SwapRequest[]>(INITIAL_SWAPS);

  function updateSwap(id: number, status: SwapRequest["status"]) {
    setSwaps(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status } : s
      )
    );
  }

  return { swaps, updateSwap };
}