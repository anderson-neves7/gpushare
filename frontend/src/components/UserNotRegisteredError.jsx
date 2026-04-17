import React from 'react';
import { Link } from 'react-router-dom';

export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-lg w-full rounded-lg surface-paper p-8 shadow-md shadow-black/10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/25">
            <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Access restricted</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your account is not registered for this deployment. Ask an administrator to invite you or enable your
            organization in the access control settings.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you believe this is a mistake, include your work email and the URL you used when you contact support.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-border bg-secondary/60 text-foreground hover:bg-secondary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
