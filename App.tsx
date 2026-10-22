import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Financial Engine & Models
import {
  approvePayout,
  collectionProgress,
  confirmedCollection,
  expectedCollection,
  money,
  outstandingCollection,
  paidMemberCount,
  recordContribution,
  verifyContribution,
  type EqubState,
  type Member,
  type Contribution,
} from "./engine/engine";
import { createDemoState } from "./engine/seed";

// Brand Theme & Localization
import { Palette, Radii, Shadows, Spacing } from "./theme/theme";
import { translations, type Language } from "./i18n/translations";

// Redesigned Components
import { BrandHeader } from "./components/BrandHeader";
import { CulturalHero } from "./components/CulturalHero";
import { FinancialSummary } from "./components/FinancialSummary";
import { ActiveEqubCard } from "./components/ActiveEqubCard";
import { RecentActivityList } from "./components/RecentActivityList";
import { ExploreEqubsView } from "./components/ExploreEqubsView";
import { MembersView } from "./components/MembersView";
import { ContributionsView } from "./components/ContributionsView";
import { PayoutsView } from "./components/PayoutsView";
import { ProfileSettingsView } from "./components/ProfileSettingsView";
import { CreateEqubModal } from "./components/CreateEqubModal";
import { RecordPaymentModal } from "./components/RecordPaymentModal";
import { AddMemberModal } from "./components/AddMemberModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { BottomNav, type TabKey } from "./components/BottomNav";

const STORAGE_KEY = "ethiopian-equb-state-v1";
const LANG_STORAGE_KEY = "ethiopian-equb-lang-v1";
const ONBOARDING_SEEN_KEY = "ethiopian-equb-onboarding-seen-v1";

export default function App() {
  const [state, setState] = useState<EqubState | null>(null);
  const [tab, setTab] = useState<TabKey>("home");
  const [lang, setLang] = useState<Language>("am");
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const t = translations[lang];

  // 1. Initial State & Language Loading
  useEffect(() => {
    (async () => {
      try {
        const [savedState, savedLang, onboardingSeen] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(LANG_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_SEEN_KEY),
        ]);

        if (savedState) {
          setState(JSON.parse(savedState) as EqubState);
        } else {
          setState(createDemoState());
        }

        if (savedLang === "am" || savedLang === "en") {
          setLang(savedLang);
        }

        if (!onboardingSeen) {
          setShowOnboardingModal(true);
        }
      } catch {
        setState(createDemoState());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2. State Persistence
  useEffect(() => {
    if (state && !loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
        Alert.alert("Storage error", "Could not persist changes to local device.");
      });
    }
  }, [state, loading]);

  // 3. Language Persistence
  const handleSelectLanguage = (newLang: Language) => {
    setLang(newLang);
    AsyncStorage.setItem(LANG_STORAGE_KEY, newLang).catch(() => {});
  };

  const handleToggleLanguage = () => {
    const next = lang === "am" ? "en" : "am";
    handleSelectLanguage(next);
  };

  // 4. Financial Calculations derived directly from existing engine
  const activeCycle = useMemo(
    () => state?.cycles.find((c) => c.status === "active") || state?.cycles[0],
    [state]
  );
  const activeCycleId = activeCycle?.id ?? "";

  const expected = state && activeCycleId ? expectedCollection(state, activeCycleId) : 0;
  const confirmed = state && activeCycleId ? confirmedCollection(state, activeCycleId) : 0;
  const outstanding = state && activeCycleId ? outstandingCollection(state, activeCycleId) : 0;
  const progress = state && activeCycleId ? collectionProgress(state, activeCycleId) : 0;
  const paidCount = state && activeCycleId ? paidMemberCount(state, activeCycleId) : 0;

  // Active Payout
  const activePayout = useMemo(
    () => state?.payouts.find((p) => p.cycleId === activeCycleId) || state?.payouts[0],
    [state, activeCycleId]
  );

  const getMemberName = (id: string) => {
    return state?.members.find((m) => m.id === id)?.name ?? "አባል (Member)";
  };

  const payoutRecipientName = activePayout
    ? getMemberName(activePayout.recipientMemberId)
    : "ተስፋዬ በቀለ";

  // Check if current user (Abebe Kebede / member-1) has paid
  const isUserPaid = useMemo(() => {
    if (!state || !activeCycleId) return false;
    const userMember = state.members[0];
    if (!userMember) return false;
    return state.contributions.some(
      (c) =>
        c.memberId === userMember.id &&
        c.cycleId === activeCycleId &&
        c.status === "confirmed"
    );
  }, [state, activeCycleId]);

  // Pending count for tab badge
  const pendingPaymentsCount = useMemo(() => {
    if (!state) return 0;
    return state.contributions.filter((c) => c.status === "pending").length;
  }, [state]);

  // 5. Business Actions
  const updateState = (fn: (current: EqubState) => EqubState) => {
    if (!state) return;
    try {
      setState(fn(state));
    } catch (error) {
      Alert.alert(
        "አልተሳካም • Action Failed",
        error instanceof Error ? error.message : "ስህተት ተፈጥሯል።"
      );
    }
  };

  const handleAddMember = (name: string, phone: string) => {
    if (state?.members.some((m) => m.phone === phone)) {
      Alert.alert("Duplicate Phone", "በዚህ ስልክ ቁጥር የተመዘገበ አባል አለ።");
      return;
    }

    updateState((s) => ({
      ...s,
      members: [
        ...s.members,
        {
          id: `member-${Date.now()}`,
          name,
          phone,
          joinedAt: new Date().toISOString(),
          status: "active",
        },
      ],
    }));

    Alert.alert(t.confirm, t.memberAddedSuccess);
  };

  const handleRecordPayment = (data: {
    memberId: string;
    amount: number;
    paymentRail: string;
    reference: string;
    note: string;
  }) => {
    if (!state || !activeCycleId) return;

    try {
      updateState((s) =>
        recordContribution(s, {
          memberId: data.memberId,
          cycleId: activeCycleId,
          amount: data.amount,
          note: data.note,
        })
      );
      Alert.alert(t.paymentSubmittedSuccess, t.paymentPendingNotice);
    } catch (err) {
      Alert.alert("ስህተት", err instanceof Error ? err.message : "ክፍያ ማስመዝገብ አልተቻለም።");
    }
  };

  const handleVerifyPayment = (payment: Contribution, isConfirmed: boolean) => {
    const action = () => {
      updateState((s) => verifyContribution(s, payment.id, isConfirmed));
    };

    if (isConfirmed) {
      Alert.alert(t.verifyBtn, t.verifyConfirmPrompt, [
        { text: t.cancel, style: "cancel" },
        { text: t.confirm, style: "default", onPress: action },
      ]);
    } else {
      Alert.alert(t.rejectBtn, t.rejectConfirmPrompt, [
        { text: t.cancel, style: "cancel" },
        { text: t.rejectBtn, style: "destructive", onPress: action },
      ]);
    }
  };

  const handleApprovePayout = (payoutId: string) => {
    updateState((s) => approvePayout(s, payoutId));
    Alert.alert(t.confirm, t.payoutApprovedSuccess);
  };

  const handleCreateEqub = (data: {
    groupName: string;
    contributionAmount: number;
    maxMembers: number;
    frequency: "monthly";
    payoutMethod: string;
    description: string;
  }) => {
    const cycleId = `cycle-${Date.now()}`;
    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth(), 25).toISOString();

    const newCircle: EqubState = {
      groupName: data.groupName,
      currency: "ETB",
      contributionAmount: data.contributionAmount,
      frequency: data.frequency,
      members: state?.members || [],
      contributions: [],
      cycles: [
        {
          id: cycleId,
          label: `${now.toLocaleString("en-US", { month: "long" })} ${now.getFullYear()}`,
          dueDate,
          contributionAmount: data.contributionAmount,
          status: "active",
          recipientMemberId: state?.members[0]?.id || "member-1",
        },
      ],
      payouts: [
        {
          id: `payout-${Date.now()}`,
          cycleId,
          recipientMemberId: state?.members[0]?.id || "member-1",
          grossAmount: data.contributionAmount * data.maxMembers,
          deductions: 0,
          netAmount: data.contributionAmount * data.maxMembers,
          status: "scheduled",
          evidenceNote: "New savings circle created",
        },
      ],
    };

    setState(newCircle);
    setTab("home");
    Alert.alert(t.createSuccessTitle, t.createSuccessMsg);
  };

  const handleResetDemo = () => {
    Alert.alert(t.resetDemoBtn, t.resetConfirmPrompt, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.confirm,
        style: "destructive",
        onPress: () => {
          const fresh = createDemoState();
          setState(fresh);
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          Alert.alert(t.confirm, "የማሳያ መረጃዎች ወደ መጀመሪያው ሁኔታ ተመልሰዋል።");
        },
      },
    ]);
  };

  // 6. Loading Screen
  if (loading || !state) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Palette.royalBlue} />
        <Text style={styles.loadingText}>ዲጂታል ዕቁብ በመጫን ላይ...</Text>
      </SafeAreaView>
    );
  }

  // 7. Render Current Tab View
  const renderTabContent = () => {
    switch (tab) {
      case "home":
        return (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Cultural Editorial Hero with gathering photo */}
            <CulturalHero
              t={t}
              onCreateEqub={() => setShowCreateModal(true)}
              onExploreEqubs={() => setTab("explore")}
            />

            {/* Emotional Encouragement Banner */}
            <View style={styles.encouragementBanner}>
              <View style={styles.bannerIconBadge}>
                <Text style={styles.bannerIconText}>✦</Text>
              </View>
              <Text style={styles.bannerMessageText}>
                {t.encouragementMilestone}
              </Text>
            </View>

            {/* Financial Summary */}
            <FinancialSummary
              t={t}
              confirmedTotal={confirmed}
              activeCirclesCount={state.cycles.length > 0 ? 1 : 0}
              nextDueDate="ጥቅምት 25 (Oct 25)"
              nextDueAmount={state.contributionAmount}
              upcomingPayoutAmount={activePayout ? activePayout.netAmount : 200000}
              upcomingPayoutRecipient={payoutRecipientName}
              outstandingTotal={outstanding}
            />

            {/* Active Circle Card */}
            <ActiveEqubCard
              t={t}
              groupName={state.groupName}
              contributionAmount={state.contributionAmount}
              memberCount={state.members.length}
              paidMembersCount={paidCount}
              progressPercent={progress}
              nextPayoutDate="ጥቅምት 25 (Oct 25)"
              nextPayoutRecipient={payoutRecipientName}
              isUserPaid={isUserPaid}
              onPressDetails={() => setTab("equb")}
              onRecordPayment={() => setShowPaymentModal(true)}
            />

            {/* Quick Actions Row */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>ፈጣን ተግባራት • QUICK ACTIONS</Text>
              <View style={styles.quickButtonsGrid}>
                <Pressable
                  onPress={() => setShowPaymentModal(true)}
                  style={({ pressed }) => [styles.quickActionBtn, pressed && styles.btnPressed]}
                >
                  <View style={[styles.quickIconWrap, { backgroundColor: Palette.royalBlueLight }]}>
                    <Text style={[styles.quickIconSymbol, { color: Palette.royalBlue }]}>💳</Text>
                  </View>
                  <Text style={styles.quickActionLabel}>{t.recordPaymentBtn}</Text>
                </Pressable>

                <Pressable
                  onPress={() => setShowAddMemberModal(true)}
                  style={({ pressed }) => [styles.quickActionBtn, pressed && styles.btnPressed]}
                >
                  <View style={[styles.quickIconWrap, { backgroundColor: Palette.confirmedGreenSurface }]}>
                    <Text style={[styles.quickIconSymbol, { color: Palette.confirmedGreen }]}>＋</Text>
                  </View>
                  <Text style={styles.quickActionLabel}>{t.addMemberBtn}</Text>
                </Pressable>

                <Pressable
                  onPress={() => setTab("explore")}
                  style={({ pressed }) => [styles.quickActionBtn, pressed && styles.btnPressed]}
                >
                  <View style={[styles.quickIconWrap, { backgroundColor: Palette.wovenGoldLight }]}>
                    <Text style={[styles.quickIconSymbol, { color: Palette.wovenGoldDark }]}>⌕</Text>
                  </View>
                  <Text style={styles.quickActionLabel}>{t.ctaExploreEqubs}</Text>
                </Pressable>
              </View>
            </View>

            {/* Recent Activity Timeline */}
            <RecentActivityList
              t={t}
              contributions={state.contributions}
              payouts={state.payouts}
              getMemberName={getMemberName}
            />
          </ScrollView>
        );

      case "explore":
        return (
          <ExploreEqubsView
            t={t}
            onCreateEqub={() => setShowCreateModal(true)}
          />
        );

      case "equb":
        return (
          <MembersView
            t={t}
            state={state}
            activeCycleId={activeCycleId}
            onAddMember={() => setShowAddMemberModal(true)}
          />
        );

      case "payments":
        return (
          <ContributionsView
            t={t}
            state={state}
            activeCycleId={activeCycleId}
            onRecordPayment={() => setShowPaymentModal(true)}
            onVerifyPayment={handleVerifyPayment}
            getMemberName={getMemberName}
          />
        );

      case "profile":
        return (
          <ProfileSettingsView
            t={t}
            lang={lang}
            onSelectLang={handleSelectLanguage}
            state={state}
            onResetDemo={handleResetDemo}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="light" />
        <StatusBar barStyle="light-content" backgroundColor={Palette.midnightNavy} />

        {/* Global Brand Header */}
        <BrandHeader
          t={t}
          lang={lang}
          onToggleLang={handleToggleLanguage}
          onOpenProfile={() => setTab("profile")}
          userName="Natnael"
        />

        {/* Main Tab Area */}
        <View style={styles.tabContentContainer}>{renderTabContent()}</View>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={tab}
          onSelectTab={setTab}
          onCreateEqub={() => setShowCreateModal(true)}
          t={t}
          pendingCount={pendingPaymentsCount}
        />

        {/* Modals */}
        <CreateEqubModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEqub}
          t={t}
        />

        <RecordPaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handleRecordPayment}
          members={state.members}
          defaultAmount={state.contributionAmount}
          t={t}
        />

        <AddMemberModal
          visible={showAddMemberModal}
          onClose={() => setShowAddMemberModal(false)}
          onAdd={handleAddMember}
          t={t}
        />

        <OnboardingModal
          visible={showOnboardingModal}
          onClose={() => {
            setShowOnboardingModal(false);
            AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true").catch(() => {});
          }}
          lang={lang}
          onSelectLang={handleSelectLanguage}
          t={t}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.midnightNavy,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Palette.midnightNavy,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  loadingText: {
    color: Palette.surfaceWhite,
    fontSize: 14,
    fontWeight: "600",
  },
  tabContentContainer: {
    flex: 1,
    backgroundColor: Palette.warmIvory,
  },
  scrollContent: {
    paddingBottom: Spacing.hero,
  },
  encouragementBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm + 2,
    ...Shadows.subtle,
  },
  bannerIconBadge: {
    width: 26,
    height: 26,
    borderRadius: Radii.full,
    backgroundColor: Palette.wovenGoldLight,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerIconText: {
    color: Palette.wovenGoldDark,
    fontSize: 13,
    fontWeight: "900",
  },
  bannerMessageText: {
    flex: 1,
    color: Palette.midnightNavy,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  quickActionsTitle: {
    color: Palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
  },
  quickButtonsGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...Shadows.subtle,
  },
  quickIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  quickIconSymbol: {
    fontSize: 18,
    fontWeight: "800",
  },
  quickActionLabel: {
    color: Palette.midnightNavy,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
