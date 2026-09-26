// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
import MethodologyBadge from '../MethodologyBadge';

describe('MethodologyBadge', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders "Trajektia Live™" correctly and displays description on hover', () => {
    render(<MethodologyBadge metric="live" />);
    
    // Check if the badge label is rendered
    const button = screen.getByRole('button', { name: /En savoir plus sur Trajektia Live™/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Trajektia Live™')).toBeInTheDocument();

    // Check if the tooltip is not visible initially
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Hover over the button
    fireEvent.mouseEnter(button);

    // Tooltip should be visible
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText("Indice salarial en temps réel basé sur l'agrégation continue des offres d'emploi au Québec.")).toBeInTheDocument();

    // Mouse leave
    fireEvent.mouseLeave(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders "Trajektia RealWage™" correctly and displays description on focus', () => {
    render(<MethodologyBadge metric="realwage" />);
    
    const button = screen.getByRole('button', { name: /En savoir plus sur Trajektia RealWage™/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Trajektia RealWage™')).toBeInTheDocument();

    // Focus the button
    fireEvent.focus(button);

    // Tooltip should be visible
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText("Médiane salariale nette calibrée selon le coût de la vie et les conventions collectives du Québec.")).toBeInTheDocument();

    // Blur the button
    fireEvent.blur(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders "Indice de Tension Trajektia™" correctly and displays description on click', () => {
    render(<MethodologyBadge metric="tension" />);
    
    const button = screen.getByRole('button', { name: /En savoir plus sur Indice de Tension Trajektia™/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Indice de Tension Trajektia™')).toBeInTheDocument();

    // Click the button
    fireEvent.click(button);

    // Tooltip should be visible
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText("Mesure de pénurie et de dynamisme de recrutement par région administrative.")).toBeInTheDocument();

    // Click again to toggle off
    fireEvent.click(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders "Profil DPC Trajektia™" correctly', () => {
    render(<MethodologyBadge metric="dpc" />);
    
    const button = screen.getByRole('button', { name: /En savoir plus sur Profil DPC Trajektia™/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Profil DPC Trajektia™')).toBeInTheDocument();

    fireEvent.mouseEnter(button);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText("Modélisation empirique Données-Personnes-Choses et projection bi-axiale de Prediger.")).toBeInTheDocument();
  });

  it('does not render tooltip when showTooltip is false', () => {
    render(<MethodologyBadge metric="live" showTooltip={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Hover over the button
    fireEvent.mouseEnter(button);

    // Tooltip should not be rendered
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
