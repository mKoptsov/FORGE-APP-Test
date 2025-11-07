import { Box, Text, Button, Stack, Inline, SectionMessage, Link } from '@forge/react';


type PullRequestCardType = {
  index: number,
  id: number,
  repository: string,
  ticketName: string,
  title: string,
  user: string,
  number: number,
  url: string,
  merged?: boolean,
  onMerge: (repository: string, number: number) => void,
}

const PullRequestCard = ({
    index,
    id,
    repository,
    ticketName,
    user='Test',
    title,
    number,
    url,
    merged = false,
    onMerge
}: PullRequestCardType) => {

  return (
    <Box padding="space.300">
      <Stack space="space.300">
        <SectionMessage appearance="information" title="Pull Request Info">
          <Text>{title}</Text>
        </SectionMessage>

        <Inline space="space.200" alignBlock="center">
          <Box>
            <Text weight="medium">{user}</Text>
          </Box>
        </Inline>

        <Box>
          <Text>User: {user}</Text>
          <Text>Repository: {repository}</Text>
          <Text>Ticket: {ticketName}</Text>
          <Link href={url}>Open on Github</Link>
        </Box>

        {!merged ? (
          <Button appearance="primary" onClick={()=> onMerge(repository, number)}>
            Merge Pull Request
          </Button>
        ) : (
          <SectionMessage appearance="success" title="Merged">
            <Text>Pull Request merged successfully!</Text>
          </SectionMessage>
        )}
      </Stack>
    </Box>
  );
};

export default PullRequestCard;
