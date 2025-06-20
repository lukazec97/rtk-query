import React from 'react'
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Greeting } from "./Greeting";

describe("Greeting", () => {
    it("Renders default greet", () => {
        render(<Greeting />)
        expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    });

    it("Renders  greet with a name", () => {
        render(<Greeting name='Luka' />)
        expect(screen.getByText('Hello, Luka!')).toBeInTheDocument();
    });
})