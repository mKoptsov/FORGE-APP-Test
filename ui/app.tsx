import React, { useState, useEffect } from 'react';
import ForgeReconciler, { Stack, Spinner, Text } from "@forge/react";

import AuthPage from './components/authPage';
import ConnectPage from './components/connectPage';
import { checkExistingToken } from './services/invokes';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);;

   useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await checkExistingToken();

        if(response?.success === true) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
        
      } catch (error) {
        console.error('Error checking token:', error);
        setIsConnected(false);
      }
    };

    verifyToken();
  }, []);

   if (isConnected === null) {
    return (
      <Stack alignBlock="center" >
        <Spinner size="medium" />
        <Text>Checking authentication...</Text>
      </Stack>
    );
  }

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