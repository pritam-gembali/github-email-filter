function processGitHubThreads() {
  // --- CONFIGURATION ---
  
  // Your specific team list
  const SUBSCRIBED_MEMBERS = [
    "pritam-gembali"
    // Add more GitHub usernames as needed
  ];
  
  const MY_TEAM_LABEL_NAME = "github updates/My Team";
  const ROE_LABEL_NAME = "github updates/ROE";

  // SEARCH QUERY:
  // We look for emails from GitHub regarding Pull Requests that are either:
  // 1. In the Inbox (New arrivals)
  // 2. OR Unread (This catches archived threads that just got a new reply)
  const searchQuery = 'from:notifications@github.com (is:inbox OR is:unread) newer_than:1d AND NOT label:'+ MY_TEAM_LABEL_NAME;
  
  // ---------------------

  // Helper to get or create the labels automatically
  const myTeamLabel = getOrCreateLabel(MY_TEAM_LABEL_NAME);
  const roeLabel = getOrCreateLabel(ROE_LABEL_NAME);

  // Fetch threads (processing 50 at a time prevents timeouts)
  const threads = GmailApp.search(searchQuery, 0, 50);

  if (threads.length === 0) {
    console.log("No matching GitHub threads found.");
    return;
  }

  threads.forEach(thread => {
    const messages = thread.getMessages();
    // Combine all message bodies in the thread to check history
    const combinedBody = messages.map(m => m.getPlainBody()).join(" ");
    
    let isTeamInvolved = false;
    
    // Scan the email text for your team members
    for (let i = 0; i < SUBSCRIBED_MEMBERS.length; i++) {
      if (combinedBody.includes(SUBSCRIBED_MEMBERS[i])) {
        isTeamInvolved = true;
        break; // Stop searching once we find one match
      }
    }

    if (isTeamInvolved) {
      // --- TEAM MEMBER FOUND ---
      // 1. Move to Inbox (Resurrect it if it was archived)
      thread.moveToInbox();
      
      // 2. Add "my team" label (We do NOT remove ROE, so you can see history)
      thread.addLabel(myTeamLabel);
      
      console.log(`Team involved: Moved to Inbox & Labeled [${thread.getFirstMessageSubject()}]`);

    } else {
      // --- NO TEAM MEMBER FOUND ---
      // 1. Add "ROE" label
      thread.addLabel(roeLabel);
      
      // 2. Archive it (Skip Inbox)
      thread.moveToArchive();
      
      // 3. Mark as Read
      thread.markRead();
      
      console.log(`ROE (Non-team): Archived & Labeled [${thread.getFirstMessageSubject()}]`);
    }
  });

  markThreadsAsRead();
}

// Helper function creates the label if it doesn't exist yet
function getOrCreateLabel(labelName) {
  let label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  return label;
}

function markThreadsAsRead() {
  let mergedThreads = GmailApp.search('in: inbox merged into master OR develop', 0, 50);
  let closedThreads = GmailApp.search('in: inbox "Closed #" AND github', 0, 25);
  let mergeQueuedThreads = GmailApp.search('in: inbox "was added to the merge queue" AND github', 0, 25);
  mergedThreads = mergedThreads.concat(closedThreads);
  mergedThreads = mergedThreads.concat(mergeQueuedThreads);
  for (let mergedThread of mergedThreads) {
    mergedThread.markRead();
    mergedThread.moveToArchive();
  }
  console.log("Marked " + mergedThreads.length+ " threads as read");
}
