export type UserRole = "admin" | "team" | "partner_ecn";

export type Client = {
  id: string;
  name: string;
  description?: string;
  color: string;
  initials: string;
  industry?: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
};

export type MissionStatus = "not_started" | "in_progress" | "completed";
export type Priority = "high" | "medium" | "low";
export type MissionCategory = "venue" | "communication" | "logistics" | "partnerships" | "content" | "finance" | "speakers" | "sponsors";

export type Subtask = {
  id: string;
  title: string;
  titleFr?: string;
  done: boolean;
  assignee?: string;
  order: number;
};

export type Mission = {
  id: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  assignees: string[];
  deadline: string;
  priority: Priority;
  status: MissionStatus;
  category: MissionCategory;
  phase: string;
  subtasks: Subtask[];
  milestoneId?: string;
  eventId: string;
};

export type MilestoneStatus = "reached" | "pending" | "at_risk" | "in_progress" | "not_started";

export type Milestone = {
  id: string;
  title: string;
  titleFr?: string;
  targetDate: string;
  responsible: string;
  successCondition: string;
  successConditionFr?: string;
  status: MilestoneStatus;
  missionIds: string[];
  eventId: string;
};

export type EndorsementStage = "identified" | "approach_started" | "meeting_held" | "verbal_agreement" | "obtained" | "refused";
export type SponsorStage = "identified" | "contacted" | "in_discussion" | "proposal_sent" | "confirmed" | "paid" | "lost";
export type SpeakerStage = "invited" | "form_sent" | "form_completed" | "confirmed" | "declined";
export type Temperature = "hot" | "warm" | "cold";
export type TargetCategory = "government" | "corporate" | "media" | "ecosystem";
export type VerificationStatus = "verified" | "verify" | "tbd";

export type PipelineTarget = {
  id: string;
  type: "endorsement" | "sponsor" | "speaker";
  organization: string;
  contactName: string;
  contactRole?: string;
  category: TargetCategory;
  stage: EndorsementStage | SponsorStage | SpeakerStage;
  assignee: string;
  notes: string;
  temperature?: Temperature;
  amount?: number;
  paymentStatus?: "committed" | "collected";
  nameVerified?: VerificationStatus;
  eventId: string;
  // Speaker registration form fields
  email?: string;
  phoneOffice?: string;
  phoneMobile?: string;
  presentationApproval?: boolean;
  videoApproval?: boolean;
  bio?: string;
  photoDataUrl?: string;
  formSubmittedAt?: string;
};

export type SponsorTier = {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  availability: string;
  isCustom: boolean;
  notes?: string;
};

export type Contact = {
  id: string;
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  source?: "speaker_form";
};

export type EventData = {
  id: string;
  name: string;
  dates: string;
  location: string;
  status: string;
  globalProgress: number;
  capacity: number;
  exhibitors: number;
};

export type ActivityEntry = {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
};

export type Notification = {
  id: string;
  type: "overdue" | "milestone" | "pipeline" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};
