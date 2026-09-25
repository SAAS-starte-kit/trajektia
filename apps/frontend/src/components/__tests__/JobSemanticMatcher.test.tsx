// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import JobSemanticMatcher from '../JobSemanticMatcher';
import * as matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';

expect.extend(matchers);

// Mock fetch globally
global.fetch = vi.fn();

describe('JobSemanticMatcher', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders input controls correctly', () => {
    render(<JobSemanticMatcher />);
    
    expect(screen.getByText("Recherche Sémantique d'Emplois")).toBeInTheDocument();
    
    // Check for query input
    expect(screen.getByPlaceholderText('ex: React, Python, gestion de projet...')).toBeInTheDocument();
    
    // Check for region select
    expect(screen.getByLabelText('Région administrative')).toBeInTheDocument();
    
    // Check for slider/min score
    expect(screen.getByText('Niveau de correspondance minimum')).toBeInTheDocument();
    
    // Check for button
    expect(screen.getByRole('button', { name: /Rechercher/i })).toBeInTheDocument();
  });

  it('handles API response and renders job cards with similarity score percentage', async () => {
    const mockResponse = {
      matches: [
        {
          job_id: '1',
          title: 'Développeur React',
          company: 'Tech Corp',
          location: 'Montréal',
          cnp_code: '21232',
          score: 0.92,
        },
        {
          job_id: '2',
          title: 'Ingénieur Logiciel',
          company: 'DataSys',
          location: 'Québec',
          cnp_code: '21231',
          score: 0.85,
        }
      ]
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const user = userEvent.setup();
    render(<JobSemanticMatcher />);

    const input = screen.getByPlaceholderText('ex: React, Python, gestion de projet...');
    await user.type(input, 'React Developer');

    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await user.click(searchButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/jobs/semantic-match', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"query":"React Developer"')
    }));

    await waitFor(() => {
      expect(screen.getByText('Développeur React')).toBeInTheDocument();
      expect(screen.getByText('92% Correspondance')).toBeInTheDocument();
      expect(screen.getByText('Ingénieur Logiciel')).toBeInTheDocument();
      expect(screen.getByText('85% Correspondance')).toBeInTheDocument();
    });
  });

  it('handles API error cleanly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const user = userEvent.setup();
    render(<JobSemanticMatcher />);

    const input = screen.getByPlaceholderText('ex: React, Python, gestion de projet...');
    await user.type(input, 'Error Test');

    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la recherche: 500')).toBeInTheDocument();
    });
  });

  it('handles empty state cleanly', async () => {
    const mockResponse = { matches: [] };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const user = userEvent.setup();
    render(<JobSemanticMatcher />);

    const input = screen.getByPlaceholderText('ex: React, Python, gestion de projet...');
    await user.type(input, 'No Match Query');

    const searchButton = screen.getByRole('button', { name: /Rechercher/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Aucun résultat trouvé')).toBeInTheDocument();
    });
  });
});
