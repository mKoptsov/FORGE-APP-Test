import githubResolver from './resolvers/github-resolver';
import { handleMergePullRequestEvent }  from './webtriggers/process-merge-pull-request-event';

export { githubResolver, handleMergePullRequestEvent };