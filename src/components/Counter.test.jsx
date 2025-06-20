import React from 'react'
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Counter from './Counter';
import userEvent from '@testing-library/user-event';

describe("Counter", () => {
    it("Renders Counter", () => {
        render(<Counter />)
        expect(screen.getByText('Counter: 0')).toBeInTheDocument();
    });

    it('Increment on button click', async () => {
        render(<Counter />)
        const button = screen.getByRole('button', {name:/increment/i})
        const counterValue = screen.getByTestId('counter-value');
        expect(counterValue.textContent).toContainEqual("0");
        await userEvent.click(button);
        expect(counterValue.textContent).toContainEqual("1");
    })
})