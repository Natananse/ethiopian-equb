export type Language = "am" | "en";

export interface Translations {
  appName: string;
  tagline: string;
  demoNotice: string;
  
  // Navigation
  navHome: string;
  navExplore: string;
  navMyEqub: string;
  navPayments: string;
  navProfile: string;
  
  // Greetings
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  
  // Hero section
  heroHeadline: string;
  heroSubtext: string;
  ctaCreateEqub: string;
  ctaExploreEqubs: string;
  
  // Financial Overview
  financialOverview: string;
  totalConfirmed: string;
  activeCircles: string;
  nextDueContribution: string;
  upcomingPayout: string;
  outstandingBalance: string;
  trackedFundsDisclaimer: string;
  
  // Active Circle
  activeCircleTitle: string;
  circleMembers: string;
  cycleProgress: string;
  cycleLabel: string;
  myStatus: string;
  statusPaid: string;
  statusUnpaid: string;
  viewCircleDetails: string;
  
  // Recent Activity & Reminders
  recentActivityTitle: string;
  noRecentActivity: string;
  statusConfirmed: string;
  statusPending: string;
  statusRejected: string;
  statusScheduled: string;
  statusPaidOut: string;
  
  // Emotional encouragement
  encouragementMilestone: string;
  encouragementContribution: string;
  encouragementReminder: string;
  encouragementCommunity: string;
  
  // Explore
  exploreTitle: string;
  exploreSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterNeighborhood: string;
  filterFamily: string;
  filterWorkplace: string;
  filterMerchant: string;
  joinRequest: string;
  joinSuccessTitle: string;
  joinSuccessMsg: string;
  groupRulesHeading: string;
  
  // Create Equb Form
  createTitle: string;
  stepBasic: string;
  stepFinancials: string;
  stepRules: string;
  stepPreview: string;
  groupNameLabel: string;
  groupNamePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  contributionAmountLabel: string;
  frequencyLabel: string;
  frequencyMonthly: string;
  frequencyWeekly: string;
  capacityLabel: string;
  startDateLabel: string;
  payoutMethodLabel: string;
  methodLottery: string;
  methodPredetermined: string;
  methodRotation: string;
  lateFeeLabel: string;
  lateFeeDesc: string;
  gracePeriodLabel: string;
  totalPoolSummary: string;
  createSubmit: string;
  createSuccessTitle: string;
  createSuccessMsg: string;
  
  // Members & Roster
  membersTitle: string;
  searchMembersPlaceholder: string;
  addMemberBtn: string;
  memberNameLabel: string;
  memberPhoneLabel: string;
  memberAddedSuccess: string;
  memberPayoutOrder: string;
  memberPaidThisCycle: string;
  memberPendingThisCycle: string;
  memberOverdueThisCycle: string;
  noMembersFound: string;
  
  // Payments & Verification
  paymentsTitle: string;
  paymentsSubtitle: string;
  recordPaymentBtn: string;
  chooseMemberLabel: string;
  amountLabel: string;
  paymentRailLabel: string;
  railTelebirr: string;
  railCBE: string;
  railBankTransfer: string;
  railCash: string;
  referenceLabel: string;
  referencePlaceholder: string;
  paymentPendingNotice: string;
  paymentSubmittedSuccess: string;
  verifyConfirmPrompt: string;
  rejectConfirmPrompt: string;
  verifyBtn: string;
  rejectBtn: string;
  
  // Payouts
  payoutsTitle: string;
  payoutsSubtitle: string;
  currentRecipient: string;
  grossAmount: string;
  approvedDeductions: string;
  netPayoutAmount: string;
  approvePayoutBtn: string;
  approvePayoutPrompt: string;
  payoutApprovedSuccess: string;
  payoutWarning: string;
  
  // Profile & Settings
  profileTitle: string;
  languageSetting: string;
  amharicLabel: string;
  englishLabel: string;
  notificationsTitle: string;
  notificationReminders: string;
  notificationPayouts: string;
  securityTitle: string;
  localStorageNote: string;
  resetDemoBtn: string;
  resetConfirmPrompt: string;
  aboutTitle: string;
  aboutText: string;
  
  // Common UI
  cancel: string;
  confirm: string;
  save: string;
  back: string;
  next: string;
  close: string;
  requiredError: string;
  invalidAmountError: string;
  duplicatePaymentError: string;
  demoLabel: string;
  etbSuffix: string;
}

export const translations: Record<Language, Translations> = {
  am: {
    appName: "ዕቁብ",
    tagline: "ባህላዊ የኢትዮጵያ የቁጠባ ማህበረሰብ",
    demoNotice: "የማሳያ ሁነታ • የተመዘገቡ መረጃዎች ብቻ • ምንም እውነተኛ ገንዘብ አይንቀሳቀስም",
    
    // Navigation
    navHome: "ዋና ገጽ",
    navExplore: "አስስ",
    navMyEqub: "ዕቁቤ",
    navPayments: "ክፍያዎች",
    navProfile: "መገለጫ",
    
    // Greetings
    greetingMorning: "እንደምን አደሩ",
    greetingAfternoon: "እንደምን ዋሉ",
    greetingEvening: "እንደምን አመሹ",
    
    // Hero
    heroHeadline: "የእርስዎ ሰዎች። የእርስዎ ግቦች። የእርስዎ ዕቁብ።",
    heroSubtext: "አብረው ይቆጥቡ፣ እምነት ይገንቡ፣ እና ግቦችዎን አንድ እርምጃ ወደፊት ያራምዱ።",
    ctaCreateEqub: "ዕቁብ ፍጠር",
    ctaExploreEqubs: "ዕቁቦችን አስስ",
    
    // Financial Overview
    financialOverview: "የፋይናንስ ማጠቃለያ",
    totalConfirmed: "የተረጋገጠ ቁጠባ",
    activeCircles: "ንቁ ዕቁቦች",
    nextDueContribution: "የሚቀጥለው ክፍያ",
    upcomingPayout: "የሚቀጥለው ምደባ",
    outstandingBalance: "ያልተሰበሰበ ቀሪ",
    trackedFundsDisclaimer: "የሚታዩት መጠኖች በቡድኑ የተመዘገቡ መረጃዎች ናቸው። መተግበሪያው ቀጥተኛ ገንዘብ አይይዝም።",
    
    // Active Circle
    activeCircleTitle: "የአሁኑ ንቁ ዕቁብ",
    circleMembers: "አባላት",
    cycleProgress: "የዙሩ እድገት",
    cycleLabel: "ንቁ ዙር",
    myStatus: "የእርስዎ ሁኔታ",
    statusPaid: "የተከፈለ",
    statusUnpaid: "ያልተከፈለ",
    viewCircleDetails: "ዝርዝሩን ተመልከት",
    
    // Recent Activity
    recentActivityTitle: "የቅርብ ጊዜ እንቅስቃሴዎች",
    noRecentActivity: "እስካሁን ምንም እንቅስቃሴ አልተመዘገበም።",
    statusConfirmed: "ተረጋግጧል",
    statusPending: "በመጠባበቅ ላይ",
    statusRejected: "ውድቅ ተደርጓል",
    statusScheduled: "ታቅዷል",
    statusPaidOut: "ተከፍሏል",
    
    // Emotional encouragement
    encouragementMilestone: "አብራችሁ ጠንካራ ማህበረሰብ እየገነባችሁ ነው።",
    encouragementContribution: "ተጨማሪ ክፍያ ተረጋግጧል። ዕቁባችሁ ወደፊት እየገሰገሰ ነው።",
    encouragementReminder: "የሚቀጥለው የዕቁብ ክፍያ ቀንዎ በጥቂት ቀናት ውስጥ ይደርሳል።",
    encouragementCommunity: "እያንዳንዱ ክፍያ ቡድኑን ወደ ግቡ ያቀርበዋል።",
    
    // Explore
    exploreTitle: "የማህበረሰብ ዕቁቦች",
    exploreSubtitle: "በአካባቢዎ ወይም በስራ ቦታዎ ያሉ የታመኑ የዕቁብ ክበቦችን ይቀላቀሉ።",
    searchPlaceholder: "ዕቁብ በስም ወይም በአይነት ፈልግ...",
    filterAll: "ሁሉም",
    filterNeighborhood: "የሰፈር",
    filterFamily: "የቤተሰብ",
    filterWorkplace: "የስራ ቦታ",
    filterMerchant: "የነጋዴዎች",
    joinRequest: "የመቀላቀያ ጥያቄ ላክ",
    joinSuccessTitle: "ጥያቄው ተልኳል",
    joinSuccessMsg: "የመቀላቀል ጥያቄዎ ለአዘጋጁ ደርሷል። ሲፈቀድ ማሳወቂያ ይደርስዎታል።",
    groupRulesHeading: "የቡድኑ ደንቦችና ህግጋት",
    
    // Create Equb Form
    createTitle: "አዲስ ዕቁብ ማቋቋም",
    stepBasic: "መሰረታዊ",
    stepFinancials: "የክፍያ ቅንብር",
    stepRules: "ደንቦች",
    stepPreview: "ቅድመ እይታ",
    groupNameLabel: "የዕቁቡ ስም",
    groupNamePlaceholder: "ለምሳሌ፦ የቦሌ ሰፈር ወርሃዊ ዕቁብ",
    descriptionLabel: "የዕቁቡ ዓላማና መግለጫ",
    descriptionPlaceholder: "የዚህ ዕቁብ ቁጠባ አላማ...",
    contributionAmountLabel: "የአንድ አባል የክፍያ መጠን (ብር)",
    frequencyLabel: "የክፍያ ድግግሞሽ",
    frequencyMonthly: "በየወሩ",
    frequencyWeekly: "በየሳምንቱ",
    capacityLabel: "የአባላት ብዛት ጣሪያ",
    startDateLabel: "የመጀመሪያ ክፍያ ቀን",
    payoutMethodLabel: "የምደባ ቅደም-ተከተል ዘዴ",
    methodLottery: "በዕጣ (Lottery)",
    methodPredetermined: "በስምምነት ቅደም-ተከተል",
    methodRotation: "በተራ ዙር (Rotation)",
    lateFeeLabel: "የዘገየ ክፍያ ቅጣት",
    lateFeeDesc: "ከጊዜ ገደብ በኋላ ላለፈ ክፍያ ቋሚ 250 ብር ቅጣት ይታከላል",
    gracePeriodLabel: "የማራዘሚያ ቀናት (3 ቀናት)",
    totalPoolSummary: "በአንድ ዙር የሚሰበሰብ ጠቅላላ ገንዘብ",
    createSubmit: "ዕቁቡን አጽድቀህ ፍጠር",
    createSuccessTitle: "ዕቁቡ ተፈጥሯል!",
    createSuccessMsg: "አዲሱ የዕቁብ ክበብዎ በተሳካ ሁኔታ ተመስርቷል። አባላትን መጋበዝ ይችላሉ።",
    
    // Members & Roster
    membersTitle: "የዕቁብ አባላት",
    searchMembersPlaceholder: "አባል በስም ወይም በስልክ ፈልግ...",
    addMemberBtn: "አዲስ አባል ጨምር",
    memberNameLabel: "ሙሉ ስም",
    memberPhoneLabel: "የስልክ ቁጥር (09...)",
    memberAddedSuccess: "አባሉ በተሳካ ሁኔታ ተመዝግቧል!",
    memberPayoutOrder: "የዕጣ ተራ ቁጥር",
    memberPaidThisCycle: "የዚህ ዙር ክፍያ ተረጋግጧል",
    memberPendingThisCycle: "ክፍያ በማረጋገጥ ላይ",
    memberOverdueThisCycle: "ያልተከፈለ ክፍያ",
    noMembersFound: "ምንም አባል አልተገኘም።",
    
    // Payments & Verification
    paymentsTitle: "ክፍያዎችና ማረጋገጫ",
    paymentsSubtitle: "የተፈጸሙ ክፍያዎች ግልጽ ማህደርና የማረጋገጫ ወረፋ።",
    recordPaymentBtn: "ክፍያ መዝግብ",
    chooseMemberLabel: "ክፍያ የፈጸመው አባል",
    amountLabel: "የተከፈለው መጠን (ብር)",
    paymentRailLabel: "የክፍያ ዘዴ",
    railTelebirr: "ቴሌብር (Telebirr)",
    railCBE: "ሲቢኢ ብር (CBE Birr)",
    railBankTransfer: "የባንክ ዝውውር",
    railCash: "በእጅ ጥሬ ገንዘብ",
    referenceLabel: "የግብይት ማጣቀሻ / ደረሰኝ ቁጥር",
    referencePlaceholder: "ለምሳሌ፦ TXN-8942018",
    paymentPendingNotice: "የተመዘገበው ክፍያ እንደ 'በመጠባበቅ ላይ' ይቀመጣል። ገንዘብ ያዡ ወይም አዘጋጁ ካረጋገጡት በኋላ ብቻ ወደ ተረጋገጠ ገቢ ይገባል።",
    paymentSubmittedSuccess: "ክፍያው ለማረጋገጥ ቀርቧል!",
    verifyConfirmPrompt: "ይህ ክፍያ በትክክል መድረሱን አረጋግጠዋል? ማረጋገጫ ከተሰጠ በኋላ በፋይናንስ መዝገብ ይጸድቃል።",
    rejectConfirmPrompt: "ይህን የክፍያ ጥያቄ ውድቅ ለማድረግ እርግጠኛ ነዎት?",
    verifyBtn: "ክፍያውን አረጋግጥ",
    rejectBtn: "ውድቅ አድርግ",
    
    // Payouts
    payoutsTitle: "የዕቁብ ምደባና ክፍፍል",
    payoutsSubtitle: "በየወሩ የሚሰበሰበው ሙሉ ድምር ለተራው ተረካቢ በፍትሃዊነት ይተላለፋል።",
    currentRecipient: "የዚህ ዙር ዕጣ አሸናፊ / ተረካቢ",
    grossAmount: "ጠቅላላ የተሰበሰበ",
    approvedDeductions: "የተፈቀዱ ቅናሾች",
    netPayoutAmount: "የተጣራ የክፍያ መጠን",
    approvePayoutBtn: "ምደባውን አጽድቅና አስረክብ",
    approvePayoutPrompt: "ይህን የዕቁብ ምደባ ሙሉ በሙሉ መረከቡን አረጋግጠው ማጽደቅ ይፈልጋሉ?",
    payoutApprovedSuccess: "ምደባው በተሳካ ሁኔታ ጸድቋል!",
    payoutWarning: "ምደባ የሚፈጸመው የተሰበሰበው ገንዘብ በትክክል ተረጋግጦ በአዘጋጁ ሲጸድቅ ብቻ ነው።",
    
    // Profile & Settings
    profileTitle: "መገለጫና ቅንብሮች",
    languageSetting: "የመተግበሪያ ቋንቋ",
    amharicLabel: "አማርኛ (Amharic)",
    englishLabel: "English",
    notificationsTitle: "የማሳወቂያ ምርጫዎች",
    notificationReminders: "የክፍያ ማስታወሻዎች (የ3 ቀን ቅድመ ማስታወቂያ)",
    notificationPayouts: "የምደባና የዕጣ ውጤቶች ማሳወቂያ",
    securityTitle: "የውሂብ ደህንነትና ግላዊነት",
    localStorageNote: "የእርስዎ መረጃዎች በአሁኑ ወቅት በመሳሪያዎ ላይ ብቻ በከፍተኛ ጥንቃቄ ተቀምጠዋል። ምንም የሶስተኛ ወገን ክፍያ አገናኝ አልተካተተም።",
    resetDemoBtn: "የማሳያ መረጃዎችን ወደነበሩበት መልስ",
    resetConfirmPrompt: "ሁሉንም የአካባቢ የሙከራ መረጃዎች ወደ መጀመሪያው ሁኔታ መመለስ ይፈልጋሉ?",
    aboutTitle: "ስለ ዲጂታል ዕቁብ",
    aboutText: "ዲጂታል ዕቁብ የኢትዮጵያን ረጅም ዘመን ያስቆጠረ የዕቁብ ባህል በዘመናዊ ቴክኖሎጂ፣ ግልጽነትና ፍትሃዊነት የሚያስተዳድር መድረክ ነው።",
    
    // Common
    cancel: "ተወው",
    confirm: "አረጋግጥ",
    save: "አስቀምጥ",
    back: "ተመለስ",
    next: "ቀጣይ",
    close: "ዝጋ",
    requiredError: "እባክዎ አስፈላጊውን መረጃ ያስገቡ።",
    invalidAmountError: "እባክዎ ትክክለኛ የብር መጠን ያስገቡ።",
    duplicatePaymentError: "ለዚህ አባል በዚህ ዙር ክፍያ አስቀድሞ ተመዝግቧል።",
    demoLabel: "የማሳያ",
    etbSuffix: "ብር",
  },
  
  en: {
    appName: "EQUB",
    tagline: "Traditional Ethiopian Savings Circle",
    demoNotice: "DEMO MODE • Local sample records only • No real money is moved",
    
    // Navigation
    navHome: "Home",
    navExplore: "Explore",
    navMyEqub: "My Equb",
    navPayments: "Payments",
    navProfile: "Profile",
    
    // Greetings
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    
    // Hero
    heroHeadline: "Your people. Your goals. Your Equb.",
    heroSubtext: "Save together, build trust, and reach your goals one contribution at a time.",
    ctaCreateEqub: "Create an Equb",
    ctaExploreEqubs: "Explore Equbs",
    
    // Financial Overview
    financialOverview: "Financial Overview",
    totalConfirmed: "Confirmed Savings",
    activeCircles: "Active Circles",
    nextDueContribution: "Next Payment Due",
    upcomingPayout: "Upcoming Payout",
    outstandingBalance: "Outstanding Arrears",
    trackedFundsDisclaimer: "All amounts represent group-verified records. The app does not hold or custody money.",
    
    // Active Circle
    activeCircleTitle: "Active Equb Circle",
    circleMembers: "Members",
    cycleProgress: "Cycle Progress",
    cycleLabel: "Active Cycle",
    myStatus: "Your Status",
    statusPaid: "Paid",
    statusUnpaid: "Unpaid",
    viewCircleDetails: "View Details",
    
    // Recent Activity
    recentActivityTitle: "Recent Activity",
    noRecentActivity: "No activity recorded yet.",
    statusConfirmed: "Confirmed",
    statusPending: "Pending Review",
    statusRejected: "Rejected",
    statusScheduled: "Scheduled",
    statusPaidOut: "Disbursed",
    
    // Emotional encouragement
    encouragementMilestone: "You're building something together.",
    encouragementContribution: "Another contribution confirmed. Your group is moving forward.",
    encouragementReminder: "Your next Equb contribution deadline is approaching.",
    encouragementCommunity: "Every contribution brings the group closer to its goal.",
    
    // Explore
    exploreTitle: "Community Equbs",
    exploreSubtitle: "Discover trusted rotating savings circles in your neighborhood or workplace.",
    searchPlaceholder: "Search by group name, neighborhood, or type...",
    filterAll: "All",
    filterNeighborhood: "Neighborhood",
    filterFamily: "Family",
    filterWorkplace: "Workplace",
    filterMerchant: "Merchants",
    joinRequest: "Request to Join",
    joinSuccessTitle: "Request Submitted",
    joinSuccessMsg: "Your join request has been sent to the organizer. You will be notified once reviewed.",
    groupRulesHeading: "Group Rules & Constitution",
    
    // Create Equb Form
    createTitle: "Create an Equb Circle",
    stepBasic: "Basic Info",
    stepFinancials: "Financials",
    stepRules: "Rules",
    stepPreview: "Preview",
    groupNameLabel: "Equb Circle Name",
    groupNamePlaceholder: "e.g., Bole Neighborhood Monthly Equb",
    descriptionLabel: "Purpose & Description",
    descriptionPlaceholder: "Describe the purpose and goals of this circle...",
    contributionAmountLabel: "Contribution per member (ETB)",
    frequencyLabel: "Contribution Frequency",
    frequencyMonthly: "Monthly",
    frequencyWeekly: "Weekly",
    capacityLabel: "Member Capacity",
    startDateLabel: "First Payment Deadline",
    payoutMethodLabel: "Payout Order Selection",
    methodLottery: "Lottery (ዕጣ)",
    methodPredetermined: "Predetermined Order",
    methodRotation: "Fixed Rotation",
    lateFeeLabel: "Late Fee Policy",
    lateFeeDesc: "Fixed 250 ETB fee applied after a 3-day grace period",
    gracePeriodLabel: "Grace Period (3 Days)",
    totalPoolSummary: "Gross Pool Collected Per Cycle",
    createSubmit: "Confirm & Create Equb",
    createSuccessTitle: "Equb Circle Created!",
    createSuccessMsg: "Your new savings circle is ready. You can now invite trusted members.",
    
    // Members & Roster
    membersTitle: "Circle Members",
    searchMembersPlaceholder: "Search members by name or phone...",
    addMemberBtn: "Add Member",
    memberNameLabel: "Full Name",
    memberPhoneLabel: "Phone Number (09...)",
    memberAddedSuccess: "Member added to roster successfully!",
    memberPayoutOrder: "Payout Position",
    memberPaidThisCycle: "Confirmed this cycle",
    memberPendingThisCycle: "Payment under review",
    memberOverdueThisCycle: "Payment overdue",
    noMembersFound: "No members found.",
    
    // Payments & Verification
    paymentsTitle: "Contributions & Verification",
    paymentsSubtitle: "Transparent financial records and verification queue.",
    recordPaymentBtn: "Record Payment",
    chooseMemberLabel: "Contributing Member",
    amountLabel: "Payment Amount (ETB)",
    paymentRailLabel: "Payment Rail / Method",
    railTelebirr: "Telebirr",
    railCBE: "CBE Birr",
    railBankTransfer: "Bank Transfer",
    railCash: "Cash (Hand-to-Hand)",
    referenceLabel: "Transaction Reference / Receipt Note",
    referencePlaceholder: "e.g., TXN-92847291 or CBE slip #",
    paymentPendingNotice: "Payments are recorded as 'Pending Review'. Only authorized treasurers can confirm funds after verifying bank or cash deposits.",
    paymentSubmittedSuccess: "Payment submitted for verification!",
    verifyConfirmPrompt: "Confirm that this deposit has been verified in the group account?",
    rejectConfirmPrompt: "Are you sure you want to reject this payment record?",
    verifyBtn: "Confirm Payment",
    rejectBtn: "Reject",
    
    // Payouts
    payoutsTitle: "Payout Rotation & Disbursements",
    payoutsSubtitle: "Each cycle, the full collected pool is disbursed to the scheduled recipient.",
    currentRecipient: "Cycle Recipient",
    grossAmount: "Gross Collection",
    approvedDeductions: "Approved Deductions",
    netPayoutAmount: "Net Disbursed Amount",
    approvePayoutBtn: "Authorize Payout Release",
    approvePayoutPrompt: "Confirm and release payout milestone to the recipient? This requires verified funds.",
    payoutApprovedSuccess: "Payout milestone recorded as disbursed!",
    payoutWarning: "Payouts are released only after all cycle funds are verified and approved.",
    
    // Profile & Settings
    profileTitle: "Profile & Settings",
    languageSetting: "Application Language",
    amharicLabel: "አማርኛ (Amharic)",
    englishLabel: "English",
    notificationsTitle: "Notification Preferences",
    notificationReminders: "Payment deadline reminders (3 days before due)",
    notificationPayouts: "Payout and lottery results alerts",
    securityTitle: "Data Security & Transparency",
    localStorageNote: "All data is securely stored on this device. No external bank integration or real wallet transfer is performed.",
    resetDemoBtn: "Reset Demo Data to Original",
    resetConfirmPrompt: "Reset all local state back to the initial 40-member demo circle?",
    aboutTitle: "About Digital Equb",
    aboutText: "Digital Equb modernizes centuries of Ethiopian rotating savings traditions with transparency, accountability, and community trust.",
    
    // Common
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    back: "Back",
    next: "Next",
    close: "Close",
    requiredError: "Please fill in all required fields.",
    invalidAmountError: "Please enter a valid positive contribution amount.",
    duplicatePaymentError: "A payment record already exists for this member in this cycle.",
    demoLabel: "DEMO",
    etbSuffix: "ETB",
  },
};
