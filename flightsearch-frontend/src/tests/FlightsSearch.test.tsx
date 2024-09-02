import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FlightSearch from "../components/FlightsSearch";

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

describe('Component Flight Search', () => {
  test('Render search form', () => {
    renderWithRouter(<FlightSearch />)
  });
})