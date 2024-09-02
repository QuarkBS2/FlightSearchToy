import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FlightResults from "../components/FlightResults";


beforeAll(() => {
  global.matchMedia = global.matchMedia || function () {
      return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };
})

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('Component Flight Results', () => {
  test('Render result list', () => {
    renderWithRouter(<FlightResults />)
  });
})
