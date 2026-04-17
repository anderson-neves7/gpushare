import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1) || 'home';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-7xl font-light text-muted-foreground/30">404</h1>
          <div className="h-0.5 w-16 bg-border mx-auto" />
        </div>
        <div className="rounded-lg surface-paper px-6 py-6 text-center space-y-3">
          <h2 className="text-2xl font-medium text-foreground">Page not found</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            The path <span className="font-medium text-foreground">&quot;{pageName}&quot;</span> does not match a route
            in this app. Check the URL for typos, or start again from the home page or marketplace.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            If you followed an old bookmark, the product may have moved; use the navigation bar after you return.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-foreground bg-muted border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            Go home
          </Link>
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-primary rounded-lg hover:opacity-90 transition-opacity"
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
