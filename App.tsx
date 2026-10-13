import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, Pressable, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  approvePayout, collectionProgress, confirmedCollection, expectedCollection,
  money, outstandingCollection, paidMemberCount, recordContribution, verifyContribution,
  type EqubState, type Member, type Contribution
} from "./engine/engine";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { createDemoState } from "./engine/seed";

type Tab = "home" | "members" | "payments" | "payouts" | "settings";
type Language = "en" | "am";
const STORAGE_KEY = "ethiopian-equb-state-v1";

const copy = {
  en: {
    dashboard: "Dashboard", members: "Members", payments: "Payments", payouts: "Payouts", settings: "Settings",
    expected: "Expected collection", collected: "Confirmed collection", outstanding: "Outstanding",
    progress: "Collection progress", paid: "Paid members", nextPayout: "Scheduled payout",
    activeCycle: "Active cycle", quickActions: "Quick actions", addMember: "Add member",
    recordPayment: "Record payment", recentPayments: "Recent payments", allMembers: "All members",
    search: "Search members...", name: "Full name", phone: "Phone number", save: "Save member",
    cancel: "Cancel", contribution: "Contribution amount (ETB)", selectMember: "Choose member",
    submitPayment: "Submit for verification", pending: "Pending", confirmed: "Confirmed", rejected: "Rejected",
    verify: "Confirm", reject: "Reject", scheduled: "Scheduled", pendingApproval: "Pending approval",
    paidStatus: "Paid", approve: "Approve payout", language: "Language", reset: "Reset demo data",
    resetConfirm: "Reset all local data to the original demo state?", noMembers: "No members found.",
    demoNotice: "DEMO MODE • Sample records only • No real money is moved",
    add: "Add", noPayments: "No payment records yet.", payoutWarning: "Payouts require authorized approval and verified funds.",
    duplicate: "Payment already exists for this member and cycle.", required: "Please enter a member name and phone number.",
    paymentSaved: "Payment submitted as pending. It is not included in confirmed totals yet.",
    memberAdded: "Member added.", confirmPayment: "Confirm this payment? Only do this after verifying the transfer.",
    yes: "Yes", no: "No", memberCount: "Total members", noPayouts: "No payout records.",
    amount: "Amount", status: "Status", noActiveCycle: "No active cycle found."
  },
  am: {
    dashboard: "ዋና ገጽ", members: "አባላት", payments: "ክፍያዎች", payouts: "የክፍያ ዝርዝር", settings: "ቅንብሮች",
    expected: "የሚጠበቅ ገቢ", collected: "የተረጋገጠ ገቢ", outstanding: "ያልተከፈለ",
    progress: "የክፍያ እድገት", paid: "የከፈሉ አባላት", nextPayout: "የታቀደ ክፍያ",
    activeCycle: "ንቁ ዙር", quickActions: "ፈጣን እርምጃዎች", addMember: "አባል ጨምር",
    recordPayment: "ክፍያ መዝግብ", recentPayments: "የቅርብ ክፍያዎች", allMembers: "ሁሉም አባላት",
    search: "አባላትን ፈልግ...", name: "ሙሉ ስም", phone: "ስልክ ቁጥር", save: "አባል መዝግብ",
    cancel: "ተወው", contribution: "የክፍያ መጠን (ብር)", selectMember: "አባል ምረጥ",
    submitPayment: "ለማረጋገጥ ላክ", pending: "በመጠባበቅ ላይ", confirmed: "ተረጋግጧል", rejected: "ውድቅ ተደርጓል",
    verify: "አረጋግጥ", reject: "ውድቅ አድርግ", scheduled: "ታቅዷል", pendingApproval: "ማጽደቅ ይጠብቃል",
    paidStatus: "ተከፍሏል", approve: "ክፍያውን አጽድቅ", language: "ቋንቋ", reset: "የሙከራ ውሂብ መጀመሪያ ላይ መልስ",
    resetConfirm: "ሁሉንም የአካባቢ ውሂብ ወደ ሙከራ መጀመሪያ ልመልስ?", noMembers: "አባል አልተገኘም።",
    demoNotice: "የሙከራ ሁኔታ • የምሳሌ ውሂብ ብቻ • እውነተኛ ገንዘብ አይንቀሳቀስም",
    add: "ጨምር", noPayments: "እስካሁን የክፍያ መዝገብ የለም።", payoutWarning: "ክፍያ የተረጋገጠ ገንዘብና የተፈቀደ ማጽደቅ ይፈልጋል።",
    duplicate: "ለዚህ አባል በዚህ ዙር ክፍያ አስቀድሞ ተመዝግቧል።", required: "እባክዎ ስምና ስልክ ያስገቡ።",
    paymentSaved: "ክፍያው ለማረጋገጥ ተልኳል። ገና በተረጋገጠ ገቢ ውስጥ አልተካተተም።",
    memberAdded: "አባሉ ተመዝግቧል።", confirmPayment: "ይህን ክፍያ ያረጋግጡ? ዝውውሩን ካረጋገጡ ብቻ ያድርጉ።",
    yes: "አዎ", no: "አይ", memberCount: "ጠቅላላ አባላት", noPayouts: "የክፍያ መዝገብ የለም።",
    amount: "መጠን", status: "ሁኔታ", noActiveCycle: "ንቁ ዙር አልተገኘም።"
  }
};

const C = {
  bg: "#0A5ED5",
  bgDeep: "#0849A8",
  panel: "#F4F9FF",
  panel2: "#E5F0FF",
  gold: "#F5C75B",
  white: "#FFFFFF",
  muted: "#4F6E8E",
  green: "#1FB97A",
  red: "#E45B74",
  blue: "#0A5ED5",
  border: "#D5E8FF",
  dark: "#0B2F5F",
  deep: "#072B5F",
  soft: "#EAF5FF"
};

export default function App() {
  const [state, setState] = useState<EqubState | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [lang, setLang] = useState<Language>("am");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("5000");
  const [paymentNote, setPaymentNote] = useState("");
  const t = copy[lang];

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setState(raw ? JSON.parse(raw) as EqubState : createDemoState());
      } catch {
        setState(createDemoState());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (state && !loading) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      Alert.alert("Storage error", "Could not save changes on this device.");
    });
  }, [state, loading]);

  const cycle = useMemo(() => state?.cycles.find(c => c.status === "active"), [state]);
  const cycleId = cycle?.id ?? "";
  const expected = state && cycleId ? expectedCollection(state, cycleId) : 0;
  const collected = state && cycleId ? confirmedCollection(state, cycleId) : 0;
  const outstanding = state && cycleId ? outstandingCollection(state, cycleId) : 0;
  const progress = state && cycleId ? collectionProgress(state, cycleId) : 0;
  const paidCount = state && cycleId ? paidMemberCount(state, cycleId) : 0;

  const update = (fn: (current: EqubState) => EqubState) => {
    if (!state) return;
    try { setState(fn(state)); }
    catch (error) { Alert.alert("Could not complete action", error instanceof Error ? error.message : "Unknown error"); }
  };

  const addMember = () => {
    if (!newName.trim() || !newPhone.trim()) { Alert.alert("Required", t.required); return; }
    if (state?.members.some(m => m.phone === newPhone.trim())) { Alert.alert("Duplicate phone", "A member with this phone number already exists."); return; }
    update(s => ({ ...s, members: [...s.members, {
      id: `member-${Date.now()}`, name: newName.trim(), phone: newPhone.trim(),
      joinedAt: new Date().toISOString(), status: "active"
    }] }));
    setNewName(""); setNewPhone(""); setShowAddMember(false);
    Alert.alert("Success", t.memberAdded);
  };

  const submitPayment = () => {
    if (!state || !cycleId || !selectedMember) { Alert.alert("Choose a member", t.selectMember); return; }
    const amount = Number(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) { Alert.alert("Invalid amount", "Enter an amount greater than zero."); return; }
    update(s => recordContribution(s, {
      memberId: selectedMember, cycleId, amount, note: paymentNote.trim() || "Entered in app"
    }));
    setShowPaymentForm(false); setPaymentNote("");
    Alert.alert("Submitted", t.paymentSaved);
  };

  const memberName = (id: string) => state?.members.find(m => m.id === id)?.name ?? "Unknown member";
  const filteredMembers = state?.members.filter(m =>
    `${m.name} ${m.phone}`.toLowerCase().includes(query.toLowerCase())
  ) ?? [];

  const verify = (payment: Contribution, confirmed: boolean) => {
    const action = () => update(s => verifyContribution(s, payment.id, confirmed));
    if (confirmed) Alert.alert("Verify payment", t.confirmPayment, [
      { text: t.no, style: "cancel" }, { text: t.yes, onPress: action }
    ]);
    else Alert.alert("Reject payment", "Reject this pending record?", [
      { text: t.cancel, style: "cancel" }, { text: t.reject, style: "destructive", onPress: action }
    ]);
  };

  const reset = () => Alert.alert(t.reset, t.resetConfirm, [
    { text: t.cancel, style: "cancel" },
    { text: t.yes, style: "destructive", onPress: () => setState(createDemoState()) }
  ]);

  if (loading || !state) return <SafeAreaView style={styles.loading}><ActivityIndicator size="large" color={C.gold}/><Text style={styles.muted}>Loading Equb…</Text></SafeAreaView>;

  const Card = ({ children, style }: { children: React.ReactNode; style?: object }) => <View style={[styles.card, style]}>{children}</View>;
  const Metric = ({ label, value, sub, color = C.white }: { label: string; value: string; sub?: string; color?: string }) => (
    <Card><Text style={styles.metricLabel}>{label}</Text><Text style={[styles.metricValue, { color }]}>{value}</Text>{sub ? <Text style={styles.mutedSmall}>{sub}</Text> : null}</Card>
  );
  const ActionButton = ({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) => (
    <Pressable onPress={onPress} style={[styles.actionButton, secondary && styles.secondaryButton]}><Text style={[styles.actionText, secondary && { color: C.blue }]}>{label}</Text></Pressable>
  );
  const Badge = ({ status }: { status: string }) => {
    const color = status === "confirmed" || status === "paid" ? C.green : status === "rejected" || status === "blocked" ? C.red : C.blue;
    const label = status === "pending_approval" ? t.pendingApproval : status === "scheduled" ? t.scheduled : status === "paid" ? t.paidStatus : status === "confirmed" ? t.confirmed : status === "pending" ? t.pending : status === "rejected" ? t.rejected : status;
    return <View style={[styles.badge, { borderColor: color }]}><Text style={{ color, fontSize: 11, fontWeight: "700" }}>{label}</Text></View>;
  };

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{t.activeCycle.toUpperCase()}</Text>
        <Text style={styles.heroTitle}>{state.groupName}</Text>
        <Text style={styles.heroSub}>{cycle?.label ?? t.noActiveCycle} · {money(state.contributionAmount)} / member</Text>
        <View style={styles.progressHeader}><Text style={styles.muted}>{t.progress}</Text><Text style={styles.progressNumber}>{progress}%</Text></View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]}/></View>
        <Text style={styles.mutedSmall}>{paidCount} / {state.members.filter(m => m.status === "active").length} members paid</Text>
      </View>
      <View style={styles.grid}>
        <Metric label={t.expected} value={money(expected)} sub={`${state.members.filter(m => m.status === "active").length} active members`}/>
        <Metric label={t.collected} value={money(collected)} sub={`${paidCount} members`} color={C.green}/>
        <Metric label={t.outstanding} value={money(outstanding)} sub={`${Math.max(0, state.members.filter(m => m.status === "active").length - paidCount)} unpaid members`} color={C.gold}/>
        <Metric label={t.memberCount} value={String(state.members.length)} sub="Demo and registered members"/>
      </View>
      <Text style={styles.sectionTitle}>{t.quickActions}</Text>
      <View style={styles.actionsRow}><ActionButton label={`＋ ${t.addMember}`} onPress={() => setShowAddMember(true)}/><ActionButton label={`＋ ${t.recordPayment}`} onPress={() => { setSelectedMember(""); setPaymentAmount(String(state.contributionAmount)); setShowPaymentForm(true); }} secondary/></View>
      <Text style={styles.sectionTitle}>{t.recentPayments}</Text>
      {state.contributions.slice(-4).reverse().map(p => <View style={styles.listRow} key={p.id}><View style={styles.avatar}><Text style={styles.avatarText}>{memberName(p.memberId).slice(0,1)}</Text></View><View style={styles.rowMain}><Text style={styles.rowTitle}>{memberName(p.memberId)}</Text><Text style={styles.mutedSmall}>{new Date(p.paidAt).toLocaleDateString()}</Text></View><View style={styles.rowRight}><Text style={styles.rowAmount}>{money(p.amount)}</Text><Badge status={p.status}/></View></View>)}
    </ScrollView>
  );

  const renderMembers = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.titleRow}><Text style={styles.pageTitle}>{t.allMembers}</Text><ActionButton label={`＋ ${t.add}`} onPress={() => setShowAddMember(true)}/></View>
      <TextInput value={query} onChangeText={setQuery} placeholder={t.search} placeholderTextColor={C.muted} style={styles.input}/>
      {filteredMembers.map((m: Member) => {
        const paid = state.contributions.some(p => p.memberId === m.id && p.cycleId === cycleId && p.status === "confirmed");
        return <View style={styles.listRow} key={m.id}><View style={styles.avatar}><Text style={styles.avatarText}>{m.name.slice(0,1)}</Text></View><View style={styles.rowMain}><Text style={styles.rowTitle}>{m.name}</Text><Text style={styles.mutedSmall}>{m.phone}</Text></View><View style={styles.rowRight}><Text style={[styles.statusText, { color: paid ? C.green : C.gold }]}>{paid ? t.confirmed : t.outstanding}</Text><Text style={styles.mutedSmall}>{paid ? money(state.contributions.find(p => p.memberId === m.id && p.cycleId === cycleId && p.status === "confirmed")?.amount ?? 0) : money(state.contributionAmount)}</Text></View></View>;
      })}
      {filteredMembers.length === 0 ? <Text style={styles.muted}>{t.noMembers}</Text> : null}
    </ScrollView>
  );

  const renderPayments = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.titleRow}><Text style={styles.pageTitle}>{t.payments}</Text><ActionButton label={`＋ ${t.add}`} onPress={() => { setSelectedMember(""); setPaymentAmount(String(state.contributionAmount)); setShowPaymentForm(true); }}/></View>
      <Text style={styles.notice}>{t.paymentSaved}</Text>
      {state.contributions.slice().reverse().map(p => <View style={styles.paymentCard} key={p.id}>
        <View style={styles.titleRow}><Text style={styles.rowTitle}>{memberName(p.memberId)}</Text><Badge status={p.status}/></View>
        <Text style={styles.rowAmount}>{money(p.amount)}</Text>
        <Text style={styles.mutedSmall}>{new Date(p.paidAt).toLocaleString()} · {p.note ?? "—"}</Text>
        {p.status === "pending" ? <View style={styles.actionsRow}><ActionButton label={t.verify} onPress={() => verify(p, true)}/><ActionButton label={t.reject} onPress={() => verify(p, false)} secondary/></View> : null}
      </View>)}
      {state.contributions.length === 0 ? <Text style={styles.muted}>{t.noPayments}</Text> : null}
    </ScrollView>
  );

  const renderPayouts = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>{t.payouts}</Text>
      <Text style={styles.notice}>{t.payoutWarning}</Text>
      {state.payouts.map(p => <View style={styles.paymentCard} key={p.id}>
        <Text style={styles.eyebrow}>{state.cycles.find(c => c.id === p.cycleId)?.label ?? p.cycleId}</Text>
        <Text style={styles.rowTitle}>{memberName(p.recipientMemberId)}</Text>
        <Text style={styles.payoutAmount}>{money(p.netAmount)}</Text>
        <Text style={styles.mutedSmall}>Gross {money(p.grossAmount)} · Deductions {money(p.deductions)}</Text>
        <View style={styles.titleRow}><Badge status={p.status}/></View>
        {p.status === "pending_approval" ? <ActionButton label={t.approve} onPress={() => Alert.alert("Approve payout", `Approve ${money(p.netAmount)} for ${memberName(p.recipientMemberId)}?`, [
          { text: t.cancel, style: "cancel" },
          { text: t.yes, onPress: () => update(s => approvePayout(s, p.id)) }
        ])}/> : null}
        {p.evidenceNote ? <Text style={styles.mutedSmall}>{p.evidenceNote}</Text> : null}
      </View>)}
      {state.payouts.length === 0 ? <Text style={styles.muted}>{t.noPayouts}</Text> : null}
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>{t.settings}</Text>
      <Card><Text style={styles.rowTitle}>{state.groupName}</Text><Text style={styles.mutedSmall}>{t.memberCount}: {state.members.length}</Text><Text style={styles.mutedSmall}>Contribution: {money(state.contributionAmount)} · Monthly</Text></Card>
      <Text style={styles.sectionTitle}>{t.language}</Text>
      <View style={styles.actionsRow}><ActionButton label="አማርኛ" onPress={() => setLang("am")} secondary={lang !== "am"}/><ActionButton label="English" onPress={() => setLang("en")} secondary={lang !== "en"}/></View>
      <Text style={styles.sectionTitle}>Data and safety</Text>
      <Text style={styles.notice}>Data is currently stored on this device only. This build has no login, cloud sync, real SMS/OTP, or payment gateway. Use demo data for testing only.</Text>
      <ActionButton label={t.reset} onPress={reset} secondary/>
      <Text style={styles.mutedSmall}>Version 1.0.0 · Local prototype</Text>
    </ScrollView>
  );

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: t.dashboard, icon: "⌂" },
    { id: "members", label: t.members, icon: "♙" },
    { id: "payments", label: t.payments, icon: "⇄" },
    { id: "payouts", label: t.payouts, icon: "◈" },
    { id: "settings", label: t.settings, icon: "⚙" },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <ExpoStatusBar style="light"/>
        <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
        <View style={styles.header}><View><Text style={styles.brand}>EQUB</Text><Text style={styles.headerSub}>ETHIOPIAN SAVINGS CIRCLE</Text></View><View style={styles.livePill}><View style={styles.liveDot}/><Text style={styles.liveText}>DEMO</Text></View></View>
        <View style={styles.demoBanner}><Text style={styles.demoBannerText}>{t.demoNotice}</Text></View>
        <View style={styles.main}>{tab === "home" ? renderHome() : tab === "members" ? renderMembers() : tab === "payments" ? renderPayments() : tab === "payouts" ? renderPayouts() : renderSettings()}</View>
        <View style={styles.tabBar}>{tabs.map(item => <Pressable key={item.id} onPress={() => tab !== item.id && setTab(item.id)} style={[styles.tabItem, tab === item.id && styles.tabActive]}><Text style={[styles.tabIcon, tab === item.id && styles.tabIconActive]}>{item.icon}</Text><Text numberOfLines={1} style={[styles.tabLabel, tab === item.id && styles.tabLabelActive]}>{item.label}</Text></Pressable>)}</View>

        {showAddMember ? <View style={styles.modalShade}><View style={styles.modal}><Text style={styles.modalTitle}>{t.addMember}</Text><TextInput value={newName} onChangeText={setNewName} placeholder={t.name} placeholderTextColor={C.muted} style={styles.input}/><TextInput value={newPhone} onChangeText={setNewPhone} placeholder={t.phone} placeholderTextColor={C.muted} keyboardType="phone-pad" style={styles.input}/><View style={styles.actionsRow}><ActionButton label={t.cancel} onPress={() => setShowAddMember(false)} secondary/><ActionButton label={t.save} onPress={addMember}/></View></View></View> : null}

        {showPaymentForm ? <View style={styles.modalShade}><View style={styles.modal}><Text style={styles.modalTitle}>{t.recordPayment}</Text><Text style={styles.fieldLabel}>{t.selectMember}</Text><ScrollView style={{ maxHeight: 220 }}>{state.members.filter(m => m.status === "active").map(m => <Pressable key={m.id} onPress={() => setSelectedMember(m.id)} style={[styles.memberOption, selectedMember === m.id && styles.memberOptionSelected]}><Text style={styles.rowTitle}>{m.name}</Text><Text style={styles.mutedSmall}>{m.phone}</Text></Pressable>)}</ScrollView><Text style={styles.fieldLabel}>{t.contribution}</Text><TextInput value={paymentAmount} onChangeText={setPaymentAmount} keyboardType="numeric" style={styles.input} placeholderTextColor={C.muted}/><TextInput value={paymentNote} onChangeText={setPaymentNote} style={styles.input} placeholder="Reference / note (optional)" placeholderTextColor={C.muted}/><View style={styles.actionsRow}><ActionButton label={t.cancel} onPress={() => setShowPaymentForm(false)} secondary/><ActionButton label={t.submitPayment} onPress={submitPayment}/></View></View></View> : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  loading: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", gap: 12 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.bg,
    borderBottomColor: "rgba(255,255,255,0.15)",
    borderBottomWidth: 1,
  },
  brand: { color: C.white, fontSize: 28, fontWeight: "900", letterSpacing: 4 },
  headerSub: { color: C.white, fontSize: 9, letterSpacing: 1.6, marginTop: 2, opacity: 0.84 },
  livePill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.45)",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.gold },
  liveText: { color: C.white, fontWeight: "800", fontSize: 10, letterSpacing: 1 },
  demoBanner: { backgroundColor: C.bgDeep, paddingVertical: 8, paddingHorizontal: 14 },
  demoBannerText: { color: "#F2F8FF", fontSize: 10, textAlign: "center", fontWeight: "700" },
  main: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 30, gap: 12 },
  hero: {
    backgroundColor: C.panel,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#062B6A",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  eyebrow: { color: C.blue, fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  heroTitle: { color: C.deep, fontSize: 24, fontWeight: "800", marginTop: 8 },
  heroSub: { color: C.muted, fontSize: 12, marginTop: 5 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 22, marginBottom: 8 },
  progressNumber: { color: C.blue, fontWeight: "800" },
  progressTrack: { height: 8, backgroundColor: "#D9E9FF", borderRadius: 9, overflow: "hidden" },
  progressFill: { height: 8, backgroundColor: C.blue, borderRadius: 9 },
  muted: { color: C.muted, fontSize: 13 },
  mutedSmall: { color: C.muted, fontSize: 11, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    backgroundColor: C.panel,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 135,
    shadowColor: "#0A3F8D",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  metricLabel: { color: C.muted, fontSize: 11, minHeight: 28 },
  metricValue: { fontSize: 18, fontWeight: "800", marginTop: 5 },
  sectionTitle: { color: C.deep, fontSize: 16, fontWeight: "800", marginTop: 8, marginBottom: 2 },
  actionsRow: { flexDirection: "row", gap: 9, marginTop: 5 },
  actionButton: {
    backgroundColor: C.blue,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 42,
    shadowColor: "#0A5ED5",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  secondaryButton: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  actionText: { color: C.white, fontWeight: "800", fontSize: 12, textAlign: "center" },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.panel,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  avatar: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#DDEEFF", alignItems: "center", justifyContent: "center" },
  avatarText: { color: C.blue, fontSize: 17, fontWeight: "900" },
  rowMain: { flex: 1 },
  rowTitle: { color: C.deep, fontWeight: "700", fontSize: 13 },
  rowRight: { alignItems: "flex-end", gap: 3 },
  rowAmount: { color: C.deep, fontWeight: "800", fontSize: 14 },
  payoutAmount: { color: C.blue, fontSize: 25, fontWeight: "900", marginVertical: 8 },
  statusText: { fontWeight: "700", fontSize: 11 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 3, marginTop: 4, alignSelf: "flex-start", backgroundColor: "#F4F9FF" },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  pageTitle: { color: C.deep, fontSize: 22, fontWeight: "900", flex: 1 },
  input: { backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, color: C.deep, fontSize: 14, marginTop: 7 },
  notice: { color: "#0B4EAF", backgroundColor: "#DDEEFF", borderRadius: 12, padding: 12, fontSize: 12, lineHeight: 18, overflow: "hidden" },
  paymentCard: { backgroundColor: C.panel, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, gap: 7 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0B52BD",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: 3,
    alignItems: "center",
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 6, gap: 3, borderRadius: 12 },
  tabActive: { backgroundColor: "#FFFFFF" },
  tabIcon: { color: "#DDEEFF", fontSize: 19, height: 22 },
  tabIconActive: { color: C.blue },
  tabLabel: { color: "#DDEEFF", fontSize: 9, fontWeight: "600" },
  tabLabelActive: { color: C.blue, fontWeight: "800" },
  modalShade: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000000AA", justifyContent: "center", padding: 18 },
  modal: { backgroundColor: C.panel, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 17, maxHeight: "90%" },
  modalTitle: { color: C.deep, fontSize: 19, fontWeight: "900", marginBottom: 10 },
  fieldLabel: { color: C.muted, fontSize: 12, fontWeight: "700", marginTop: 9 },
  memberOption: { padding: 10, borderBottomWidth: 1, borderBottomColor: C.border, borderRadius: 8 },
  memberOptionSelected: { backgroundColor: "#E5F1FF", borderWidth: 1, borderColor: C.blue }
});
