import React, { useState } from 'react';
import { Text, Textfield, Button, Heading, Stack } from '@forge/react';

import { saveAndVerifyToken }  from '../services/invokes';


interface AuthPageProps {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthPage: React.FC<AuthPageProps> = ({ setIsConnected }) => {
	const [token, setToken] = useState('');
	const [status, setStatus] = useState('');

  const handleConnect = async() => {
    const response = await saveAndVerifyToken(token);

    if(response.success) {
      setIsConnected(true);
			setStatus('✅ Token saved successfully!');
    } else {
			setStatus('❌ Token is invalid, Please try again!');
      setIsConnected(false);
    }

  };

  return (
    <Stack space="space.200" alignBlock="center">
      <Heading size="medium">Please authenticate</Heading>
			<Textfield value={token} onChange={(e) => setToken(e.target.value)} />
      <Button appearance="primary" onClick={handleConnect}>Connect</Button>
			{status && <Text>{status}</Text>}
    </Stack>
  );
};

export default AuthPage;