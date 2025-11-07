import React, { useEffect, useState } from "react";
import ForgeReconciler, { DynamicTable, Text, Link, Spinner, Heading, Stack } from "@forge/react";
import { requestJira } from "@forge/bridge";

import { getRepositoriesForUser, getPullRequests, mergePullRequest } from "../services/invokes";
import PullRequestCard from "./pullRequest-card";
import type { Repository, ResponseGetOpenPR } from "../../common/types";

type PullRequestCardType = {
  index: number,
  id: number,
  number: number,
  repository: string,
  ticketName: string,
  title: string,
  url: string,
  onMerge: () => {},
}

type Ticket = {
  expand: string,
  self: string
  id: string,
  key: string
}

const ConnectPage: React.FC = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pullRequests, setPullRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const repositories = await getRepositoriesForUser();

        const cells = repositories.map((repository: Repository) => {
          const { name, description, url } = repository;
          return { cells: [
            {content: name },
            {content: description },
            {content: 
              <Link href={url} openNewTab>
                Open
              </Link> 
             }
          ]}
        });

        const repositoryNames = repositories.map((r: Repository) => r.name);

        const allOpenPRs = await getPullRequests(repositoryNames);

        let tickets: Ticket[];
        try {
          tickets = await Promise.all(allOpenPRs.result.map(async (pullRequest: ResponseGetOpenPR) => {
          const res = await requestJira(`/rest/api/3/issue/${pullRequest.ticketName}`);
          return await res.json();
        }));
        } catch (error) {
          console.log(error);
        }

        const prsWithTickets = allOpenPRs.result.filter((pullRequest: ResponseGetOpenPR) =>
          tickets.some((ticket: Ticket) => pullRequest.ticketName === ticket.key)
        );

        console.log('her', allOpenPRs);
        console.log('her2', tickets);
        console.log('prsWithTickets', prsWithTickets);
        setPullRequests(prsWithTickets);


        setRepos(cells);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const handleMerge = async(repo: string, id: number) => {
    const res = mergePullRequest(repo, id);
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
      ) : (
        <DynamicTable
          head={{
            cells: [
              { key: "name", content: "Name", isSortable: true },
              { key: "project", content: "Project", isSortable: true },
              { key: "link", content: "Link" },
            ],
          }}
          rows={repos}
          defaultSortKey="name"
          defaultSortOrder="ASC"
        />
      )}
      <Heading size="medium" >
        Your Open Pull Requests
      </Heading>

      {pullRequests.length === 0 ? (
        <Text>No open pull requests.</Text>
      ) : (
        <Stack space="space.400">
          {pullRequests.map((pr: any, index: number) => (
            <PullRequestCard
              index={index}
              id={pr.id}
              number={pr.number}
              ticketName={pr.ticketName}
              repository={pr.repository}
              title={pr.title}
              user='Test'
              url={pr.url}
              onMerge={handleMerge}
            />
          ))}
        </Stack>
      )}
    </>

  );
};

export default ConnectPage;

