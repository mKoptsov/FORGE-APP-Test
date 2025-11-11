import React, { useEffect, useState } from "react";
import { Text, Spinner, Heading, Stack } from "@forge/react";
import { requestJira } from "@forge/bridge";

import { getRepositoriesForUser, getPullRequests, mergePullRequest, approvePullRequest } from "../services/invokes";
import PullRequestCard from "./pullRequest-card";
import Repositories from "./repositories";

import type { Repository, ResponseGetOpenPR } from "../../common/types";

type PullRequestWithStatus = ResponseGetOpenPR & {
  merged?: boolean;
  errorMessage?: string;
};

type Ticket = {
  expand: string,
  self: string
  id: string,
  key: string
}

const ConnectPage: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequestWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const result = await getRepositoriesForUser();   
     
        if (result.success && result.data) {
          setRepos(result.data);
        }
      
        const repositoryNames = result.data.map((r: Repository) => r.name);

        const allOpenPRs = await getPullRequests(repositoryNames);

        const tickets = await Promise.all(allOpenPRs.data.map(async (pullRequest: ResponseGetOpenPR) => {
          const res = await requestJira(`/rest/api/3/issue/${pullRequest.ticketName}`);
          return await res.json();
        }));
       

        const prsWithTickets = allOpenPRs.data.filter((pullRequest: ResponseGetOpenPR) =>
          tickets.some((ticket: Ticket) => pullRequest.ticketName === ticket.key)
        );

        setPullRequests(prsWithTickets);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);


  const handleMerge = async(repo: string, prNumber: number) => {
    try {
      const { success, error } = await mergePullRequest(repo, prNumber);

      if(success){
        setPullRequests(prev =>
          prev.map(pr =>
            pr.prNumber === prNumber ? { ...pr, merged: true } : pr
          )
        );
      } else {
        setPullRequests(prev =>
          prev.map(pr =>
            pr.prNumber === prNumber ? { ...pr, merged: false,  errorMessage: error.message} : pr
          )
        );
      }

    } catch (error) {
         setPullRequests(prev =>
          prev.map(pr =>
            pr.prNumber === prNumber ? { ...pr, merged: false,  errorMessage: error.message} : pr
          )
        )
    }
    
  }

  const handleApprove = async(repo: string, prNumber: number) => {
    try {
      const { success, error } = await approvePullRequest(repo, prNumber);
      console.log('here', success, error);
    } catch (error) {
      console.log('ha ha ha');
    }
    
  }

  if (loading) {
    return <Spinner size="small" label="Loading repositories..." />;
  }

  if (error) {
    return <Text size="large">Error loading repositories</Text>
  }

  return (
    <>
      <Heading size="medium">Your Bitbucket Repositories</Heading>
      {repos.length === 0 ? (
        <Text>No repositories found.</Text>
      ) :
      (<Repositories repositories={repos} />)
      }
      <Heading size="medium" >
        Your Open Pull Requests
      </Heading>

      {pullRequests.length === 0 ? (
        <Text>No open pull requests.</Text>
      ) : (
        <Stack space="space.400">
          {pullRequests.map((pr: PullRequestWithStatus, index: number) => (
            <PullRequestCard
              index={index}
              id={pr.id}
              prNumber={pr.prNumber}
              ticketName={pr.ticketName}
              repository={pr.repository}
              title={pr.title}
              user={pr.prOwnerName}
              url={pr.url}
              onMerge={handleMerge}
              onApprove={handleApprove}
              errorMessage={pr.errorMessage}
            />
          ))}
        </Stack>
      )}
    </>

  );
};

export default ConnectPage;

