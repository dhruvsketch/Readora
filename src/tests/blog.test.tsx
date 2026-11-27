import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { BlogPage } from '../pages/BlogPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { BLOG_POSTS } from '../data/blogData';

describe('Readora Premium Editorial Blog System', () => {
  it('renders exactly five blog cards with editorial header', () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <BlogPage />
      </MemoryRouter>
    );

    // Verify Editorial Header
    expect(screen.getAllByText(/the readora journal/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1, name: /stories, ideas & perspectives/i })).toBeTruthy();
    expect(
      screen.getByText(/explore thoughtful articles about digital reading, discovering books/i)
    ).toBeTruthy();

    // Verify all 5 blog titles exist
    expect(screen.getByText('Why Online Book Reading Platforms Are Changing the Way We Read')).toBeTruthy();
    expect(screen.getByText('Digital Library: A Smarter Way to Access Knowledge and Explore Books')).toBeTruthy();
    expect(screen.getByText('Online Reading Community: Why Reading Is Better When We Share Ideas')).toBeTruthy();
    expect(screen.getByText('Book Discovery Platform: How to Find Your Next Favourite Book')).toBeTruthy();
    expect(screen.getByText('Book Sharing Community: Turning Reading Experiences into Shared Knowledge')).toBeTruthy();

    // Verify all 5 "More →" CTA buttons exist with correct routes
    const moreButtons = screen.getAllByRole('link', { name: /read more about/i });
    expect(moreButtons.length).toBe(5);

    expect(moreButtons[0].getAttribute('href')).toBe('/blog/online-book-reading-platforms');
    expect(moreButtons[1].getAttribute('href')).toBe('/blog/digital-library');
    expect(moreButtons[2].getAttribute('href')).toBe('/blog/online-reading-community');
    expect(moreButtons[3].getAttribute('href')).toBe('/blog/book-discovery-platform');
    expect(moreButtons[4].getAttribute('href')).toBe('/blog/book-sharing-community');
  });

  it('renders an individual blog article page with full editorial content', () => {
    render(
      <MemoryRouter initialEntries={['/blog/digital-library']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Title & Category
    expect(screen.getByRole('heading', { level: 1, name: /digital library: a smarter way to access knowledge/i })).toBeTruthy();
    expect(screen.getAllByText('Digital Library').length).toBeGreaterThan(0);

    // Author
    expect(screen.getAllByText('Julian Vance').length).toBeGreaterThan(0);

    // Back to Journal Link
    const backLink = screen.getByRole('link', { name: /back to the readora journal/i });
    expect(backLink).toBeTruthy();
    expect(backLink.getAttribute('href')).toBe('/blog');

    // Editorial Pullquote
    expect(screen.getByText(/libraries have always been the guardians of civic memory/i)).toBeTruthy();

    // Key Insights
    expect(screen.getByText(/key editorial insights/i)).toBeTruthy();

    // Related Recommendations
    expect(screen.getByRole('heading', { level: 2, name: /more from the journal/i })).toBeTruthy();
  });

  it('renders not found view when an invalid slug is accessed', () => {
    render(
      <MemoryRouter initialEntries={['/blog/non-existent-article']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /article not found/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /return to journal/i }).getAttribute('href')).toBe('/blog');
  });
});
