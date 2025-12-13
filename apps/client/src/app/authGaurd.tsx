import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { CWSpinner } from '@chartwright/ui-components';
import { useParams } from 'react-router-dom';

function AuthGaurd({ children }: { children: React.ReactNode }) {
  const { chart_id } = useParams();
  const { isAuthenticated, isLoading, user, signinRedirect } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Authenticated user
    if (isAuthenticated && user) {
      return;
    }

    // Protected route → force login
    if (!isAuthenticated && chart_id) {
      signinRedirect();
      return;
    }
  }, [isAuthenticated, isLoading, user, chart_id, signinRedirect]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <CWSpinner />
      </div>
    );
  }

  return children;
}

export default React.memo(AuthGaurd);
