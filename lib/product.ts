/** Product narrative — Business Outcome Intelligence. Honest about vision vs shipped. */

export const CYCLE = [
  { id: "understand", label: "Understand", detail: "A business goal or situation is stated in plain language." },
  { id: "detect", label: "Detect", detail: "Relevant signals are identified — stalled work, gaps, opportunities." },
  { id: "decide", label: "Decide", detail: "A next action is proposed, with a short reason you can review." },
  { id: "act", label: "Act", detail: "Authorized work runs through the right capability — or waits for approval." },
  { id: "verify", label: "Verify", detail: "Evidence of what actually happened is recorded." },
  { id: "improve", label: "Improve", detail: "Unresolved work becomes the next recommendation." },
] as const;

export const PROBLEMS = [
  {
    title: "What is stalled?",
    body: "Leads, replies, and follow-ups pile up without a clear view of what needs a human decision.",
  },
  {
    title: "What should happen next?",
    body: "Teams jump between inboxes and tools instead of a ranked set of next actions.",
  },
  {
    title: "Did it work?",
    body: "After something is sent or scheduled, there is often no clear evidence trail to learn from.",
  },
] as const;

export const DEMO_STEPS = [
  { phase: "Goal", text: "Recover stalled enquiries from the last 7 days." },
  { phase: "Detect", text: "12 leads with no reply after first contact." },
  { phase: "Decide", text: "Propose a follow-up sequence for the 6 highest-intent leads." },
  { phase: "Approve", text: "You review the messages before anything is sent." },
  { phase: "Act", text: "Approved messages queue through the lead capability." },
  { phase: "Verify", text: "Evidence: 6 queued, 0 sent without approval, timestamps recorded." },
] as const;

export const TRUST = [
  { title: "Approvals", body: "Consequential actions can wait for a person. The interface is not the security boundary." },
  { title: "Permissions", body: "Workspaces and business context stay separate. Backend authorization is required for real execution." },
  { title: "Evidence", body: "Outcomes are recorded as planned, running, waiting, completed, failed, or blocked — not invented success metrics." },
] as const;

export const ECOSYSTEM = [
  { name: "Renolt Flow", status: "Primary focus", line: "Business goals, orchestration, and authorized execution." },
  { name: "Renolt Personal", status: "Vision", line: "A personal assistant experience on the same foundation." },
  { name: "Workers + Rooms", status: "Vision", line: "Capable workers in controlled contexts — planned, not shipping claims." },
] as const;

export const ORCHESTRATORS = [
  { name: "Lead", role: "Enquiries, qualification, follow-up queues." },
  { name: "Omni", role: "Multi-channel messages in one place, with human approval." },
  { name: "Email", role: "Sequences and follow-ups from approved templates." },
  { name: "Content", role: "Scheduled posts and campaigns under review." },
] as const;
