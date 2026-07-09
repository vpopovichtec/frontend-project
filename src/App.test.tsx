import { test, expect } from "vitest";
import {render, screen} from '@testing-library/react'
import App from './App'

test('should show rendered hello', () => {
  render(<App />);
  
  const helloElement = screen.getByText('Hello');

  expect(helloElement).toBeInTheDocument();
});