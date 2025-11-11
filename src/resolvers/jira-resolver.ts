import { storage } from '@forge/api';
import Resolver from '@forge/resolver';

import { GithubClient } from '../clients/Github';

const resolver = new Resolver();

resolver.define('getRepositories', async () => {
	const owner = []; // maybe need to know about storage; 
  const client = new GithubClient('https://api.github.com'); // in env should be and add like private


  let userName: string = await storage.get('username');

  console.log('userName', userName);


  if(userName === undefined) {
    const user =  await client.getUser();

    userName = user.login;
  }
  
  const result = await client.getListRepositoriesByUser(userName);
  console.log('result', result);
  return result;
});