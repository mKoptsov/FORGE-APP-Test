import {
  Box,
  Text,
  Button,
  Stack,
  Inline,
  SectionMessage,
  Link,
} from "@forge/react";

type PullRequestCardType = {
  index: number;
  id: number;
  repository: string;
  ticketName: string;
  title: string;
  user: string;
  prNumber: number;
  url: string;
  errorMessage: string;
  merged?: boolean;
  approved?: boolean
  onMerge: (repository: string, prNumber: number) => void;
  onApprove: (repository: string, prNumber: number) => void;
};

const PullRequestCard = ({
  index,
  id,
  repository,
  ticketName,
  user,
  title,
  prNumber,
  url,
  errorMessage,
  merged = false,
  approved = false,
  onMerge,
  onApprove
}: PullRequestCardType) => {
  return (
    <Box padding="space.300">
      <Stack space="space.300">
        <SectionMessage appearance="information" title="Pull Request Info">
          <Text>{title}</Text>
        </SectionMessage>
        <Box>
          <Text>User: {user}</Text>
          <Text>Repository: {repository}</Text>
          <Text>Ticket: {ticketName}</Text>
          <Link href={url} openNewTab>Open on Github</Link>
        </Box>
        {errorMessage && <Text>{errorMessage}</Text>}
        {!merged ? (
          <Button
            appearance="primary"
            onClick={() => onMerge(repository, prNumber)}
          >
            Merge Pull Request
          </Button>
        ) : (
          <SectionMessage appearance="success" title="Merged">
            <Text>Pull Request merged successfully!</Text>
          </SectionMessage>
        )}
        {!approved ? (
          <Button
            appearance="primary"
            onClick={() => onApprove(repository, prNumber)}
          >
            Approve Pull Request
          </Button>
        ) : (
          <Button
            appearance="subtle"
            isDisabled
          >
            Approved
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default PullRequestCard;
