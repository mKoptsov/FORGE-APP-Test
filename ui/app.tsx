import React, { useState } from 'react';
import ForgeReconciler, { Stack } from "@forge/react";
import AuthPage from './components/authPage';
import ConnectPage from './components/connectPage';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Stack>
      {isConnected ? (
        <ConnectPage />
      ) : (
        <AuthPage setIsConnected={setIsConnected} />
      )}
    </Stack>
  );
};

ForgeReconciler.render(<App />);