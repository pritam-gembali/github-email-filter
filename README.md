# GitHub Email Filter

A Google Apps Script application that automatically filters and organizes GitHub notification emails in Gmail based on team member involvement.

## Overview

This script helps you manage GitHub notification emails by automatically categorizing them based on whether your team members are mentioned. It keeps relevant notifications in your inbox while archiving others, helping you focus on what matters to your team.

## Features

- **Smart Filtering**: Automatically scans GitHub notification emails for mentions of specified team members
- **Automatic Labeling**: Applies custom labels to categorize emails:
  - `github updates/My Team` - Emails mentioning your team members
  - `github updates/ROE` - Rest of emails (no team member involvement)
- **Inbox Management**:
  - Keeps team-relevant emails in your inbox
  - Archives non-team emails automatically
  - Marks non-relevant emails as read
- **Smart Thread Handling**: Automatically marks merged PRs, closed issues, and merge queue notifications as read
- **Handles Archived Threads**: Resurfaces archived threads back to inbox when a team member gets involved

## How It Works

1. **Searches** for GitHub notification emails from the last day that are either in your inbox or unread
2. **Scans** all messages in each thread for mentions of team members from your configured list
3. **Categorizes** emails:
   - **Team Involved**: Moves to inbox, adds "My Team" label
   - **Not Team Involved**: Archives, marks as read, adds "ROE" label
4. **Cleans Up**: Automatically archives and marks as read:
   - PRs merged into master or develop
   - Closed issues/PRs
   - Merge queue notifications

## Setup

### 1. Create a New Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **New Project**
3. Copy the contents of `code.gs` into the script editor
4. Save the project with a meaningful name (e.g., "GitHub Email Filter")

### 2. Configure Your Team Members

Edit the `SUBSCRIBED_MEMBERS` array in `code.gs` (lines 5) to include your team's GitHub usernames:

```javascript
const SUBSCRIBED_MEMBERS = [
  "username1",
  "username2",
  "username3",
  // Add your team members here
];
```

### 3. Set Up Triggers (Automation)

1. In the Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. Click **Add Trigger** in the bottom right
3. Configure the trigger:
   - Function: `processGitHubThreads`
   - Event source: **Time-driven**
   - Type of time based trigger: **Minutes timer**
   - Minutes interval: **Every 5 minutes** (or your preferred frequency)
4. Click **Save**
5. Grant necessary permissions when prompted

### 4. Grant Permissions

When you first run the script or set up a trigger, you'll need to:
1. Review and authorize the required permissions
2. The script needs access to your Gmail to read and modify emails

## Configuration Options

You can customize the following in `code.gs`:

- **SUBSCRIBED_MEMBERS** (lines 5-19): List of GitHub usernames to monitor
- **MY_TEAM_LABEL_NAME** (line 21): Label name for team-related emails
- **ROE_LABEL_NAME** (line 22): Label name for other emails
- **searchQuery** (line 28): Gmail search query (advanced users)
- **Thread limits** (lines 37, 97-99): Number of threads processed per run

## Labels Created

The script automatically creates these Gmail labels if they don't exist:

- **github updates/My Team**: Emails where your team members are mentioned
- **github updates/ROE**: Other GitHub emails (Rest of Everyone)

## Manual Execution

To test or run the script manually:

1. Open your Apps Script project
2. Select `processGitHubThreads` from the function dropdown
3. Click the **Run** button
4. Check the **Execution log** at the bottom for results

## How to View Logs

1. In Apps Script editor, click **Executions** (clock icon) in the left sidebar
2. Click on any execution to see detailed logs
3. Logs show which threads were processed and how they were categorized

## Troubleshooting

**Script times out**: The script processes 50 threads at a time to prevent timeouts. If you have many emails, it will process them across multiple trigger runs.

**Labels not appearing**: The script creates labels automatically on first run. Make sure you've executed the function at least once.

**Emails not being filtered**: Check that:
- GitHub usernames in `SUBSCRIBED_MEMBERS` match exactly (case-sensitive)
- The trigger is set up and running
- You've granted the necessary Gmail permissions

## Notes

- The script searches for emails from the last day (`newer_than:1d`)
- Processes up to 50 threads per execution to avoid timeouts
- Already labeled "My Team" emails are excluded from subsequent searches
- The script preserves existing labels (doesn't remove "ROE" when adding "My Team")
- Archived threads with team mentions are resurfaced to the inbox

## License

This project is open source and available for personal use.
