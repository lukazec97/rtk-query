import React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("initial value is 5", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });
  it("increment", () => {
    const { result } = renderHook(() => useCounter(0));
    expect(result.current.count).toBe(0);
    
    act(() => {
        result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
  it("decrement", () => {
    const { result } = renderHook(() => useCounter(3));
    expect(result.current.count).toBe(3);
    
    act(() => {
        result.current.decrement();
    });
    expect(result.current.count).toBe(2);
  });
});
