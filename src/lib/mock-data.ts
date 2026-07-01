import type {
  User, Mission, Milestone, Subtask, PipelineTarget, Contact, EventData, ActivityEntry, SponsorTier, Notification,
} from "./types";

export const currentUser: User = {
  id: "u1",
  name: "Lionel Malonga",
  email: "lionel.malonga.pro@gmail.com",
  role: "admin",
  organization: "Local",
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Erica Oghoghorie", email: "", role: "team", organization: "ECN" },
  { id: "u3", name: "Jovita Nsoh", email: "jovita@aec.com", role: "partner_ecn", organization: "AEC" },
  { id: "u4", name: "Symon Rubens", email: "", role: "partner_ecn", organization: "Local" },
  { id: "u5", name: "Marcillac Malonga", email: "", role: "partner_ecn", organization: "ECN" },
];

export const event: EventData = {
  id: "evt1",
  name: "CEMAC Data Center, Energy & AI Infrastructure Summit 2026",
  dates: "20–22 October 2026",
  location: "Brazzaville, Republic of the Congo",
  status: "In preparation",
  globalProgress: 0,
  capacity: 200,
  exhibitors: 20,
};

export const milestones: Milestone[] = [
  { id: "ml1", title: "Partner kick-off & alignment call", titleFr: "Appel de lancement et alignement partenaires", targetDate: "2026-06-16", responsible: "joint", successCondition: "Dates confirmed, roles, RACI agreed", successConditionFr: "Dates confirmées, rôles et RACI définis", status: "reached", missionIds: [], eventId: "evt1" },
  { id: "ml2", title: "Wave 1 speaker invites out", titleFr: "Envoi des invitations intervenants vague 1", targetDate: "2026-06-19", responsible: "u1", successCondition: "Invite pack + speaker form ready; top 25 priority targets agreed", successConditionFr: "Pack invitation + formulaire prêts ; top 25 cibles prioritaires validées", status: "in_progress", missionIds: [], eventId: "evt1" },
  { id: "ml3", title: "4th advisory board member confirmed", titleFr: "4ème membre du comité consultatif confirmé", targetDate: "2026-06-30", responsible: "u1", successCondition: "Bio + headshot received; board now 4+", successConditionFr: "Bio + photo reçues ; comité désormais 4+ membres", status: "in_progress", missionIds: [], eventId: "evt1" },
  { id: "ml4", title: "Venue shortlist complete", titleFr: "Sélection de sites finalisée", targetDate: "2026-06-30", responsible: "partner_ecn", successCondition: "3 costed Brazzaville options", successConditionFr: "3 options Brazzaville chiffrées", status: "not_started", missionIds: ["m1"], eventId: "evt1" },
  { id: "ml5", title: "Board touchpoint #1 — topic validation", titleFr: "Point comité n°1 — validation des thèmes", targetDate: "2026-07-08", responsible: "u2", successCondition: "Agenda v2 circulated; board validates themes + speaker wishlist", successConditionFr: "Ordre du jour v2 circulé ; le comité valide les thèmes et la liste des intervenants souhaités", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml6", title: "Venue contract signed", titleFr: "Contrat de salle signé", targetDate: "2026-07-10", responsible: "partner_ecn", successCondition: "Cannot launch publicly without a locked venue", successConditionFr: "Impossible de lancer publiquement sans salle confirmée", status: "not_started", missionIds: ["m1", "m2", "m3", "m4", "m5"], eventId: "evt1" },
  { id: "ml7", title: "Corporate + media endorsements secured", titleFr: "Endorsements corporate et médias obtenus", targetDate: "2026-07-10", responsible: "u1", successCondition: "Letters + logo approvals in hand", successConditionFr: "Lettres + approbations de logo obtenues", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml8", title: "Sponsorship prospectus approved", titleFr: "Prospectus de sponsoring approuvé", targetDate: "2026-07-10", responsible: "partner_ecn", successCondition: "Tiers + pricing validated; headline-tier private convos open", successConditionFr: "Paliers + tarifs validés ; conversations privées tier principal ouvertes", status: "reached", missionIds: [], eventId: "evt1" },
  { id: "ml9", title: "Government endorsement secured", titleFr: "Endorsement gouvernemental obtenu", targetDate: "2026-07-14", responsible: "u1", successCondition: "Longest lead item — outreach starts w/c 15 Jun", successConditionFr: "Démarche la plus longue — prise de contact à partir du 15 juin", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml10", title: "Launch go/no-go review", titleFr: "Revue go/no-go de lancement", targetDate: "2026-07-16", responsible: "joint", successCondition: "All launch criteria green", successConditionFr: "Tous les critères de lancement au vert", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml11", title: "15 speakers confirmed, forms returned", titleFr: "15 intervenants confirmés, formulaires reçus", targetDate: "2026-07-17", responsible: "u2", successCondition: "Launch threshold met", successConditionFr: "Seuil de lancement atteint", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml12", title: "★ PUBLIC LAUNCH", titleFr: "★ LANCEMENT PUBLIC", targetDate: "2026-07-21", responsible: "joint", successCondition: "Announce endorsements + advisory board + first 15 speakers", successConditionFr: "Annonce des endorsements + comité consultatif + 15 premiers intervenants", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml13", title: "★ SPONSORSHIP SALES LIVE", titleFr: "★ OUVERTURE DES VENTES SPONSORS", targetDate: "2026-07-22", responsible: "u1", successCondition: "Day after launch — full sales push to 40-prospect list", successConditionFr: "Lendemain du lancement — démarchage intensif sur liste 40 prospects", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml14", title: "30 speakers confirmed", titleFr: "30 intervenants confirmés", targetDate: "2026-08-28", responsible: "u1", successCondition: "Wave 2 complete", successConditionFr: "Vague 2 complète", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml15", title: "Board touchpoint #2 — agenda review", titleFr: "Point comité n°2 — revue du programme", targetDate: "2026-09-09", responsible: "u2", successCondition: "Board reviews near-final agenda before lock", successConditionFr: "Le comité examine l'ordre du jour quasi-final avant verrouillage", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml16", title: "All 40 speakers confirmed, forms in", titleFr: "40 intervenants confirmés, formulaires reçus", targetDate: "2026-09-11", responsible: "u2", successCondition: "No agenda lock without forms", successConditionFr: "Pas de verrouillage du programme sans formulaires", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml17", title: "★ FINAL AGENDA LOCKED", titleFr: "★ PROGRAMME DÉFINITIF VERROUILLÉ", targetDate: "2026-09-18", responsible: "joint", successCondition: ">1 month before event, per requirement", successConditionFr: "> 1 mois avant l'événement, selon les exigences", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml18", title: "Full agenda published + 30-day countdown", titleFr: "Programme complet publié + compte à rebours 30 jours", targetDate: "2026-09-21", responsible: "u2", successCondition: "Registration push starts", successConditionFr: "Campagne d'inscription lancée", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml19", title: "All sponsors contracted", titleFr: "Tous les sponsors sous contrat", targetDate: "2026-09-25", responsible: "joint", successCondition: "Branding/print production deadline", successConditionFr: "Délai de production branding/impression", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml20", title: "Speaker briefing calls (5–9 Oct)", titleFr: "Appels de briefing intervenants (5–9 oct.)", targetDate: "2026-10-05", responsible: "u2", successCondition: "Grouped by day/track; run of show shared", successConditionFr: "Regroupés par jour/piste ; déroulé de l'événement partagé", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml21", title: "Board touchpoint #3 — final briefing", titleFr: "Point comité n°3 — briefing final", targetDate: "2026-10-07", responsible: "u2", successCondition: "Board roles on-site agreed", successConditionFr: "Rôles du comité sur site définis", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml22", title: "Tech checks & rehearsals (12–15 Oct)", titleFr: "Vérifications techniques et répétitions (12–15 oct.)", targetDate: "2026-10-15", responsible: "u2", successCondition: "AV, hybrid platform, MC walkthrough", successConditionFr: "AV, plateforme hybride, répétition MC", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml23", title: "Final joining instructions to speakers", titleFr: "Instructions logistiques finales aux intervenants", targetDate: "2026-10-16", responsible: "u2", successCondition: "Logistics, run of show, contact sheet", successConditionFr: "Logistique, déroulé, fiche contacts", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml24", title: "★ EVENT — 20–22 October", titleFr: "★ ÉVÉNEMENT — 20–22 octobre", targetDate: "2026-10-20", responsible: "u2", successCondition: "Showtime", successConditionFr: "C'est parti !", status: "not_started", missionIds: [], eventId: "evt1" },
  { id: "ml25", title: "Post-event debrief & thank-yous", titleFr: "Débriefing post-événement et remerciements", targetDate: "2026-10-30", responsible: "u2", successCondition: "Joint debrief; content follow-up", successConditionFr: "Débriefing commun ; suivi de contenu", status: "not_started", missionIds: [], eventId: "evt1" },
];

export const missions: Mission[] = [
  {
    id: "m1",
    title: "Obtain 3rd costed venue option",
    titleFr: "Obtenir une 3ème option de salle chiffrée",
    description: "Venue shortlist milestone requires 3 costed Brazzaville options. 2 received (CICK + Hilton). Need a 3rd.",
    descriptionFr: "Le jalon liste de salles requiert 3 options Brazzaville chiffrées. 2 reçues (CICK + Hilton). Il en faut une 3ème.",
    assignees: ["u1"], deadline: "2026-06-30", priority: "high", status: "not_started", category: "venue", phase: "Pre-launch",
    subtasks: [
      { id: "s1", title: "Identify 3rd venue candidate", titleFr: "Identifier le 3ème candidat", done: false, order: 1 },
      { id: "s2", title: "Request proforma", titleFr: "Demander le proforma", done: false, order: 2 },
      { id: "s3", title: "Receive costed proposal", titleFr: "Recevoir la proposition chiffrée", done: false, order: 3 },
    ],
    milestoneId: "ml4", eventId: "evt1",
  },
  {
    id: "m2",
    title: "Confirm exhibition space pricing",
    titleFr: "Confirmer le tarif de l'espace exposition",
    description: "20 tables (6ft) + 2 chairs each — not costed in current proformas. Need explicit quote from all venues.",
    descriptionFr: "20 tables (6 pieds) + 2 chaises chacune — non chiffrées dans les proformas actuels. Devis explicite nécessaire de chaque salle.",
    assignees: ["u1"], deadline: "2026-07-05", priority: "high", status: "not_started", category: "venue", phase: "Pre-launch",
    subtasks: [
      { id: "s4", title: "Send exhibition spec to CICK", titleFr: "Envoyer les spécs exposition au CICK", done: false, order: 1 },
      { id: "s5", title: "Send exhibition spec to Hilton", titleFr: "Envoyer les spécs exposition à l'Hilton", done: false, order: 2 },
      { id: "s6", title: "Send exhibition spec to 3rd venue", titleFr: "Envoyer les spécs à la 3ème salle", done: false, order: 3 },
      { id: "s7", title: "Receive all quotes", titleFr: "Recevoir tous les devis", done: false, order: 4 },
    ],
    milestoneId: "ml6", eventId: "evt1",
  },
  {
    id: "m3",
    title: "Confirm missing AV elements",
    titleFr: "Confirmer les éléments AV manquants",
    description: "Confidence monitor, speaker timer, switcher/tech crew — in requirements doc but not explicit in proformas.",
    descriptionFr: "Moniteur de confiance, minuterie, régie technique — dans le cahier des charges mais absents des proformas.",
    assignees: ["u1"], deadline: "2026-07-05", priority: "high", status: "not_started", category: "venue", phase: "Pre-launch",
    subtasks: [
      { id: "s8", title: "List AV gaps vs requirements", titleFr: "Lister les manques AV vs cahier des charges", done: false, order: 1 },
      { id: "s9", title: "Send AV checklist to venues", titleFr: "Envoyer la checklist AV aux salles", done: false, order: 2 },
      { id: "s10", title: "Receive confirmations/quotes", titleFr: "Recevoir les confirmations/devis", done: false, order: 3 },
    ],
    milestoneId: "ml6", eventId: "evt1",
  },
  {
    id: "m4",
    title: "Compare costed venue options",
    titleFr: "Comparer les options de salle chiffrées",
    description: "Side-by-side comparison of all 3 venues on cost, capacity, AV, exhibition space, catering, and location.",
    descriptionFr: "Comparatif des 3 salles sur le coût, la capacité, l'AV, l'espace exposition, la restauration et l'emplacement.",
    assignees: ["u1"], deadline: "2026-07-08", priority: "medium", status: "not_started", category: "venue", phase: "Pre-launch",
    subtasks: [
      { id: "s11", title: "Build comparison matrix", titleFr: "Construire la matrice de comparaison", done: false, order: 1 },
      { id: "s12", title: "Score each option", titleFr: "Noter chaque option", done: false, order: 2 },
      { id: "s13", title: "Present recommendation", titleFr: "Présenter la recommandation", done: false, order: 3 },
    ],
    milestoneId: "ml6", eventId: "evt1",
  },
  {
    id: "m5",
    title: "Negotiate and sign venue contract",
    titleFr: "Négocier et signer le contrat de salle",
    description: "Final negotiation and contract signature with selected venue. Deposit payment.",
    descriptionFr: "Négociation finale et signature du contrat avec la salle retenue. Versement de l'acompte.",
    assignees: ["u1"], deadline: "2026-07-10", priority: "high", status: "not_started", category: "venue", phase: "Pre-launch",
    subtasks: [
      { id: "s14", title: "Negotiate terms", titleFr: "Négocier les termes", done: false, order: 1 },
      { id: "s15", title: "Legal review", titleFr: "Revue juridique", done: false, order: 2 },
      { id: "s16", title: "Sign contract", titleFr: "Signer le contrat", done: false, order: 3 },
      { id: "s17", title: "Process deposit payment", titleFr: "Effectuer le paiement de l'acompte", done: false, order: 4 },
    ],
    milestoneId: "ml6", eventId: "evt1",
  },
  {
    id: "m6",
    title: "Prepare & send government endorsement letters",
    titleFr: "Préparer et envoyer les lettres d'endorsement gouvernemental",
    description: "Draft official solicitation letters for PM office and ministries. Longest lead item.",
    descriptionFr: "Rédiger les lettres de sollicitation officielles pour le bureau du PM et les ministères. Délai le plus long.",
    assignees: ["u1"], deadline: "2026-07-10", priority: "high", status: "not_started", category: "partnerships", phase: "Pre-launch",
    subtasks: [
      { id: "s18", title: "Draft letter template", titleFr: "Rédiger le modèle de lettre", done: false, order: 1 },
      { id: "s19", title: "Identify correct contact for each ministry", titleFr: "Identifier le bon interlocuteur dans chaque ministère", done: false, order: 2 },
      { id: "s20", title: "Send letters to PM office + Min. Numérique", titleFr: "Envoyer les lettres au bureau du PM + Min. du Numérique", done: false, order: 3 },
      { id: "s21", title: "Follow up and schedule meetings", titleFr: "Relancer et planifier des réunions", done: false, order: 4 },
      { id: "s22", title: "Obtain signed endorsement letters", titleFr: "Obtenir les lettres d'endorsement signées", done: false, order: 5 },
    ],
    milestoneId: "ml9", eventId: "evt1",
  },
  {
    id: "m7",
    title: "Secure corporate & media endorsements",
    titleFr: "Obtenir les endorsements corporate et médias",
    description: "Approach corporate and media targets for endorsement letters + logo approvals.",
    descriptionFr: "Approcher les cibles corporate et médias pour les lettres d'endorsement + approbations de logo.",
    assignees: ["u1"], deadline: "2026-07-10", priority: "high", status: "not_started", category: "partnerships", phase: "Pre-launch",
    subtasks: [
      { id: "s23", title: "Send endorsement request to corporate targets", titleFr: "Envoyer la demande d'endorsement aux cibles corporate", done: false, order: 1 },
      { id: "s24", title: "Send endorsement request to media targets", titleFr: "Envoyer la demande d'endorsement aux cibles médias", done: false, order: 2 },
      { id: "s25", title: "Collect signed letters + logos", titleFr: "Collecter les lettres signées + logos", done: false, order: 3 },
    ],
    milestoneId: "ml7", eventId: "evt1",
  },
  {
    id: "m8",
    title: "Prepare speaker invite pack & form",
    titleFr: "Préparer le pack invitation intervenants et le formulaire",
    description: "Create speaker invitation package with event details, speaker registration form, and logistics info.",
    descriptionFr: "Créer le pack d'invitation avec les détails de l'événement, le formulaire d'inscription et les informations logistiques.",
    assignees: ["u2"], deadline: "2026-06-19", priority: "high", status: "in_progress", category: "speakers", phase: "Pre-launch",
    subtasks: [
      { id: "s26", title: "Finalize speaker registration form", titleFr: "Finaliser le formulaire d'inscription intervenant", done: true, order: 1 },
      { id: "s27", title: "Create invite pack document", titleFr: "Créer le document pack invitation", done: false, order: 2 },
      { id: "s28", title: "Agree top 25 priority targets with Lionel", titleFr: "Valider le top 25 cibles prioritaires avec Lionel", done: false, order: 3 },
      { id: "s29", title: "Send Wave 1 invites", titleFr: "Envoyer les invitations vague 1", done: false, order: 4 },
    ],
    milestoneId: "ml2", eventId: "evt1",
  },
  {
    id: "m9",
    title: "Recruit 4th advisory board member",
    titleFr: "Recruter le 4ème membre du comité consultatif",
    description: "Identify and confirm the 4th advisory board member. Need bio + headshot.",
    descriptionFr: "Identifier et confirmer le 4ème membre du comité consultatif. Bio + photo nécessaires.",
    assignees: ["u1"], deadline: "2026-06-30", priority: "high", status: "in_progress", category: "content", phase: "Pre-launch",
    subtasks: [
      { id: "s30", title: "Shortlist candidates", titleFr: "Présélectionner les candidats", done: true, order: 1 },
      { id: "s31", title: "Approach preferred candidate", titleFr: "Approcher le candidat privilégié", done: false, order: 2 },
      { id: "s32", title: "Receive bio + headshot", titleFr: "Recevoir la bio + la photo", done: false, order: 3 },
    ],
    milestoneId: "ml3", eventId: "evt1",
  },
  {
    id: "m10",
    title: "Prepare launch readiness checklist",
    titleFr: "Préparer la checklist de préparation au lancement",
    description: "Compile all launch go/no-go criteria and verify status before the review meeting.",
    descriptionFr: "Compiler tous les critères go/no-go du lancement et vérifier leur état avant la réunion de revue.",
    assignees: ["u1", "u2"], deadline: "2026-07-16", priority: "high", status: "not_started", category: "communication", phase: "Pre-launch",
    subtasks: [
      { id: "s33", title: "Venue confirmed", titleFr: "Salle confirmée", done: false, order: 1 },
      { id: "s34", title: "Endorsements secured", titleFr: "Endorsements obtenus", done: false, order: 2 },
      { id: "s35", title: "15 speakers confirmed", titleFr: "15 intervenants confirmés", done: false, order: 3 },
      { id: "s36", title: "Website ready", titleFr: "Site web prêt", done: false, order: 4 },
      { id: "s37", title: "PR materials prepared", titleFr: "Supports PR préparés", done: false, order: 5 },
    ],
    milestoneId: "ml10", eventId: "evt1",
  },
];

// Update milestones with mission links
milestones.find(m => m.id === "ml2")!.missionIds = ["m8"];
milestones.find(m => m.id === "ml3")!.missionIds = ["m9"];
milestones.find(m => m.id === "ml7")!.missionIds = ["m7"];
milestones.find(m => m.id === "ml9")!.missionIds = ["m6"];
milestones.find(m => m.id === "ml10")!.missionIds = ["m10"];

export const pipelineTargets: PipelineTarget[] = [
  { id: "p1", type: "endorsement", organization: "Office of the Prime Minister (High Patronage)", contactName: "PM Anatole Collinet Makosso", contactRole: "Primary — via Min. Frédéric Nzé (Posts, Telecoms & Digital Economy)", category: "government", stage: "identified", assignee: "u1", notes: "Government reshuffled 24 Apr 2026 (Makosso II). Verify names/titles before sending letters.", nameVerified: "verified", eventId: "evt1" },
  { id: "p2", type: "endorsement", organization: "ARPCE (telecoms/posts regulator)", contactName: "DG Louis-Marc Sakala", contactRole: "Backup", category: "government", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p3", type: "endorsement", organization: "ANSSI (National Cybersecurity Agency)", contactName: "DG Conrad Onésime Oboulhas Tsahat", contactRole: "Approach via Presidency / National Security Council", category: "government", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p4", type: "endorsement", organization: "Min. Environnement, Bassin du Congo & Dév. durable", contactName: "Ministre Arlette Soudan-Nonault", contactRole: "Energy/sustainability", category: "government", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p5", type: "endorsement", organization: "Congo Telecom", contactName: "DG Yves Castanou", contactRole: "Primary — national operator", category: "corporate", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p6", type: "endorsement", organization: "BDEAC (CEMAC regional dev bank)", contactName: "Président Dieudonné Evou Mekou", contactRole: "Telecoms/DFI", category: "corporate", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p7", type: "endorsement", organization: "MTN Congo", contactName: "CEO Mohammed Rufai", contactRole: "Telecoms", category: "corporate", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p8", type: "endorsement", organization: "BGFIBank Congo", contactName: "CEO Yvon-Serge Foungui", contactRole: "Banking", category: "corporate", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p9", type: "endorsement", organization: "BCI (Banque Commerciale Internationale — BCP Group)", contactName: "CEO André Collet", contactRole: "Banking", category: "corporate", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p10", type: "endorsement", organization: "BSCA Bank (Sino-Congolaise pour l'Afrique)", contactName: "Président Rigobert Roger Andely ; CEO Wang Shenghong", contactRole: "Banking", category: "corporate", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p11", type: "endorsement", organization: "NSIA Assurances Congo", contactName: "CEO Joël Ellah Kouassi", contactRole: "Insurance", category: "corporate", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p12", type: "endorsement", organization: "Les Dépêches de Brazzaville + Télé Congo", contactName: "DG Télé Congo André Ondelé", contactRole: "Primary", category: "media", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
  { id: "p13", type: "endorsement", organization: "DRTV (private channel)", contactName: "Owner Gén. Norbert Dabira; current DG TBC", contactRole: "Addition", category: "media", stage: "identified", assignee: "u1", notes: "Current DG name needs verification.", nameVerified: "verify", eventId: "evt1" },
  { id: "p14", type: "endorsement", organization: "Agence Ecofin / WeAreTech Africa, CIO Mag", contactName: "Media contacts TBD", contactRole: "Backup", category: "media", stage: "identified", assignee: "u1", notes: "Contacts not yet identified.", nameVerified: "tbd", eventId: "evt1" },
  { id: "p15", type: "endorsement", organization: "APSI-CG (assoc. pro sécurité info Congo)", contactName: "Président Murphy Semo Miekountima", contactRole: "Partner/speakers", category: "ecosystem", stage: "identified", assignee: "u1", notes: "", nameVerified: "verified", eventId: "evt1" },
];

export const sponsorTiers: SponsorTier[] = [
  { id: "t1", name: "Lead Sponsor (exclusive)", price: 40000, currency: "EUR", availability: "1", isCustom: false },
  { id: "t2", name: "Platinum", price: 25000, currency: "EUR", availability: "2", isCustom: false },
  { id: "t3", name: "Gold Plus", price: 18000, currency: "EUR", availability: "4", isCustom: false, notes: "⚠️ Listed as $18,000 in prospectus while all other tiers are in €. Currency to confirm with ECN." },
  { id: "t4", name: "Gold", price: 15000, currency: "EUR", availability: "4–6", isCustom: false },
  { id: "t5", name: "Silver", price: 10000, currency: "EUR", availability: "6", isCustom: false },
  { id: "t6", name: "Bronze", price: 8000, currency: "EUR", availability: "4", isCustom: false },
  { id: "t7", name: "Networking Reception", price: 8000, currency: "EUR", availability: "2", isCustom: false },
  { id: "t8", name: "Lunch", price: 8000, currency: "EUR", availability: "2", isCustom: false },
  { id: "t9", name: "Lanyard", price: 7000, currency: "EUR", availability: "1", isCustom: false },
  { id: "t10", name: "Networking Break", price: 7000, currency: "EUR", availability: "2", isCustom: false },
  { id: "t11", name: "WiFi", price: 7000, currency: "EUR", availability: "1", isCustom: false },
  { id: "t12", name: "Networking App", price: 7000, currency: "EUR", availability: "1", isCustom: false },
  { id: "t13", name: "Exhibitor", price: 5000, currency: "EUR", availability: "multiple", isCustom: false },
  { id: "t14", name: "Institutional Partner", price: null, currency: "EUR", availability: "limited", isCustom: true },
  { id: "t15", name: "Custom", price: null, currency: "EUR", availability: "—", isCustom: true },
];

export const contacts: Contact[] = [];

export const activityLog: ActivityEntry[] = [
  { id: "a1", userId: "u1", action: "seeded", target: "Real project data loaded — 25 milestones, 15 endorsement targets, 5 venue missions", timestamp: "2026-06-29T10:00:00Z" },
];

export const notifications: Notification[] = [
  { id: "n1", type: "milestone", title: "Milestone approaching", message: "Venue shortlist complete — due 30 Jun 2026", timestamp: "2026-06-29T08:00:00Z", read: false },
  { id: "n2", type: "milestone", title: "Milestone approaching", message: "4th advisory board member confirmed — due 30 Jun 2026", timestamp: "2026-06-29T08:00:00Z", read: false },
  { id: "n3", type: "info", title: "Data flag", message: "Gold Plus tier listed as $18,000 — all other tiers in €. Confirm currency with ECN.", timestamp: "2026-06-29T10:00:00Z", read: false },
  { id: "n4", type: "info", title: "Data flag", message: "Hilton proforma says 'departure 21 Oct 2016' — typo to flag with hotel.", timestamp: "2026-06-29T10:00:00Z", read: false },
  { id: "n5", type: "info", title: "Protocol note", message: "Government reshuffled 24 Apr 2026 (Makosso II). Verify names/titles before sending letters.", timestamp: "2026-06-29T10:00:00Z", read: false },
];

export function getMissionProgress(mission: Mission): number {
  if (mission.subtasks.length === 0) {
    return mission.status === "completed" ? 100 : 0;
  }
  const done = mission.subtasks.filter((s) => s.done).length;
  return Math.round((done / mission.subtasks.length) * 100);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

// Assignees can be a known user id OR a free-text name typed in manually.
// Falls back to the raw string when no matching user is found.
export function getAssigneeFirstName(idOrName: string): string {
  const user = getUserById(idOrName);
  return user ? user.name.split(" ")[0] : idOrName;
}

// Only Admin and Team members do operational work — ECN Partners are read-only
// viewers and shouldn't be suggested as assignees (they can still appear if
// they were assigned before a role change, or typed in as free text).
export function getAssignableUsers(): User[] {
  return users.filter((u) => u.role === "admin" || u.role === "team");
}

// Localization helpers — return the French field when locale is "fr" and it exists,
// otherwise fall back to the English field.
export function missionTitle(m: Pick<Mission, "title" | "titleFr">, locale: string): string {
  return (locale === "fr" && m.titleFr) ? m.titleFr : m.title;
}

export function missionDescription(m: Pick<Mission, "description" | "descriptionFr">, locale: string): string {
  return (locale === "fr" && m.descriptionFr) ? m.descriptionFr : m.description;
}

export function milestoneTitle(ml: Pick<Milestone, "title" | "titleFr">, locale: string): string {
  return (locale === "fr" && ml.titleFr) ? ml.titleFr : ml.title;
}

export function milestoneSuccessCondition(ml: Pick<Milestone, "successCondition" | "successConditionFr">, locale: string): string {
  return (locale === "fr" && ml.successConditionFr) ? ml.successConditionFr : ml.successCondition;
}

export function subtaskTitle(st: Pick<Subtask, "title" | "titleFr">, locale: string): string {
  return (locale === "fr" && st.titleFr) ? st.titleFr : st.title;
}

// Recalculate event global progress from missions
export function getGlobalProgress(): number {
  if (missions.length === 0) return 0;
  const total = missions.reduce((sum, m) => sum + getMissionProgress(m), 0);
  return Math.round(total / missions.length);
}
