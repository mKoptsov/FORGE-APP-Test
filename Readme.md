GitHub & Jira Integration App

This application integrates GitHub repositories with Jira tasks, providing a seamless way to manage pull requests (PRs) related to your Jira tickets directly from the app.
---

## Features

### Connected Screen
- **List Repositories:** Fetches and displays all repositories from your GitHub account.
- **Repository Details:** Shows full information about each repository, including:
  - Name
  - Url
  - Other relevant metadata
- **Open Pull Requests:** For each repository, displays an open PR related to a Jira task.  
  - If no PR exists for the task, an empty state is shown: *“No open pull requests”*.
  - If a PR exists, it is displayed in a card with:
    - Repository information
    - Link to the PR on GitHub
    - Option to **approve and merge** the PR

### PR Management
- **Approve and Merge PR:** Users can approve and merge PRs directly from the app interface.
- **Jira Ticket Update:** When a PR is merged:
  - The app automatically updates the corresponding Jira ticket status to **Done**.
  - Webhooks are used to detect PR merge events and trigger Jira ticket updates.

### Task Linking
- PRs are automatically linked to Jira tasks by parsing branch name.  
  - Example: `feature/KAN-1-add-something` or `fix/NONE-1-add-something`