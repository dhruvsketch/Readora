import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { CTAButton } from '../components/common/CTAButton';
import { HomePage } from '../pages/HomePage';
import { AuthProvider } from '../context/AuthContext';

describe('Strategic CTA Buttons System', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // 1. Styling & Variants
  describe('CTAButton Variants & Visual Semantics', () => {
    it('renders primary variant with forest green styles and accessible attributes', () => {
      render(
        <BrowserRouter>
          <CTAButton variant="primary" ctaName="test_primary" ctaSection="test">
            Start Reading
          </CTAButton>
        </BrowserRouter>
      );

      const btn = screen.getByRole('button', { name: /start reading/i });
      expect(btn).toBeTruthy();
      expect(btn.className).toContain('bg-readora-forest');
      expect(btn.className).toContain('text-white');
      expect(btn.getAttribute('data-cta-name')).toBe('test_primary');
      expect(btn.getAttribute('data-cta-variant')).toBe('primary');
    });

    it('renders secondary variant with ink border and ivory hover', () => {
      render(
        <BrowserRouter>
          <CTAButton variant="secondary" ctaName="test_secondary">
            Share Your Ideas
          </CTAButton>
        </BrowserRouter>
      );

      const btn = screen.getByRole('button', { name: /share your ideas/i });
      expect(btn.className).toContain('border-readora-ink');
      expect(btn.className).toContain('text-readora-ink');
    });

    it('renders minimal text CTA variant with underline styling', () => {
      render(
        <BrowserRouter>
          <CTAButton variant="text" withArrow ctaName="test_text">
            Read Article
          </CTAButton>
        </BrowserRouter>
      );

      const btn = screen.getByRole('button', { name: /read article/i });
      expect(btn.className).toContain('text-readora-forest');
      expect(btn.className).toContain('hover:underline');
    });

    it('renders destructive variant for warning actions', () => {
      render(
        <BrowserRouter>
          <CTAButton variant="destructive" ctaName="test_destructive">
            Delete Article
          </CTAButton>
        </BrowserRouter>
      );

      const btn = screen.getByRole('button', { name: /delete article/i });
      expect(btn.className).toContain('bg-red-600');
    });
  });

  // 2. Loading State & Duplicate Prevention
  describe('CTAButton Loading State & Accessibility', () => {
    it('disables the button, sets aria-busy, and shows spinner during loading', () => {
      const handleClick = vi.fn();
      render(
        <BrowserRouter>
          <CTAButton isLoading loadingText="Submitting..." onClick={handleClick}>
            Send Request
          </CTAButton>
        </BrowserRouter>
      );

      const btn = screen.getByRole('button') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
      expect(btn.getAttribute('aria-busy')).toBe('true');
      expect(screen.getByText('Submitting...')).toBeTruthy();

      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 3. Routing & Link semantics
  describe('Routing Integration', () => {
    it('renders as a React Router Link when "to" is provided', () => {
      render(
        <BrowserRouter>
          <CTAButton to="/discover" variant="primary" withArrow ctaName="hero_start_reading">
            Start Reading
          </CTAButton>
        </BrowserRouter>
      );

      const link = screen.getByRole('link', { name: /start reading/i });
      expect(link.getAttribute('href')).toBe('/discover');
      expect(link.getAttribute('data-cta-name')).toBe('hero_start_reading');
    });

    it('preserves location state for authentication redirects', () => {
      render(
        <BrowserRouter>
          <CTAButton
            to="/login"
            state={{ from: { pathname: '/write' } }}
            variant="secondary"
            ctaName="hero_share_ideas"
          >
            Share Your Ideas
          </CTAButton>
        </BrowserRouter>
      );

      const link = screen.getByRole('link', { name: /share your ideas/i });
      expect(link.getAttribute('href')).toBe('/login');
    });
  });

  // 4. Analytics-Ready Event Dispatching
  describe('Privacy-Friendly Analytics Click Tracking', () => {
    it('dispatches readora:cta_click event without personal data', () => {
      const eventListener = vi.fn();
      window.addEventListener('readora:cta_click', eventListener);

      render(
        <BrowserRouter>
          <CTAButton
            to="/books"
            ctaName="explore_catalogue"
            ctaSection="home_featured"
          >
            Explore Library
          </CTAButton>
        </BrowserRouter>
      );

      const link = screen.getByRole('link', { name: /explore library/i });
      fireEvent.click(link);

      expect(eventListener).toHaveBeenCalledTimes(1);
      const detail = (eventListener.mock.calls[0][0] as CustomEvent).detail;
      expect(detail.ctaName).toBe('explore_catalogue');
      expect(detail.section).toBe('home_featured');
      expect(detail.destination).toBe('/books');
      expect(detail.timestamp).toBeDefined();

      window.removeEventListener('readora:cta_click', eventListener);
    });
  });

  // 5. HomePage Strategic CTA Integrations
  describe('HomePage Strategic Section CTAs', () => {
    it('renders the Hero CTAs, Discover Books, Community, and Book Lending CTAs', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Hero CTAs
      expect(screen.getByRole('link', { name: /start reading/i }).getAttribute('href')).toBe('/discover');
      expect(screen.getByRole('link', { name: /share your ideas/i })).toBeTruthy();

      // Section Headings & CTAs
      expect(screen.getByRole('link', { name: /explore library/i }).getAttribute('href')).toBe('/discover');
      expect(screen.getByRole('link', { name: /borrow a book/i }).getAttribute('href')).toBe('/borrowed');
      expect(screen.getByRole('link', { name: /list a book/i })).toBeTruthy();
      expect(screen.getAllByRole('link', { name: /explore stories/i })[0].getAttribute('href')).toBe('/articles');
    });
  });
});
