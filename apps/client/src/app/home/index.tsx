import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/chart');
  }, [navigate]);

  return null;
}

export default React.memo(Home);
