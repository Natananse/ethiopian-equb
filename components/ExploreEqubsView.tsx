import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import { Palette, Radii, Shadows, Spacing } from "../theme/theme";
import type { Translations } from "../i18n/translations";
import { money } from "../engine/engine";

interface ExploreEqubsViewProps {
  t: Translations;
  onCreateEqub: () => void;
}

interface CommunityEqub {
  id: string;
  name: string;
  category: "neighborhood" | "family" | "workplace" | "merchant";
  categoryLabel: string;
  membersCount: number;
  maxMembers: number;
  monthlyAmount: number;
  frequency: string;
  payoutMethod: string;
  location: string;
  rulesSummary: string;
  isVerified: boolean;
}

const SAMPLE_COMMUNITY_EQUBS: CommunityEqub[] = [
  {
    id: "eq-bole-01",
    name: "የቦሌ ሰፈር ወርሃዊ ዕቁብ (Bole Neighborhood Circle)",
    category: "neighborhood",
    categoryLabel: "የሰፈር • Neighborhood",
    membersCount: 40,
    maxMembers: 40,
    monthlyAmount: 5000,
    frequency: "በየወሩ (Monthly)",
    payoutMethod: "በዕጣ (Lottery)",
    location: "ቦሌ ማጠቃለያ አካባቢ፣ አዲስ አበባ",
    rulesSummary: "ክፍያ በየወሩ 5ኛ ቀን ይጠናቀቃል። የ3 ቀናት የጊዜ ቅናሽ አለ። ዋስ ማቅረብ ግዴታ ነው።",
    isVerified: true,
  },
  {
    id: "eq-merkato-02",
    name: "የመርካቶ ነጋዴዎች የጋራ ዕቁብ (Merkato Traders Circle)",
    category: "merchant",
    categoryLabel: "የነጋዴዎች • Merchants",
    membersCount: 28,
    maxMembers: 30,
    monthlyAmount: 10000,
    frequency: "በየወሩ (Monthly)",
    payoutMethod: "በስምምነት ቅደም-ተከተል (Predetermined)",
    location: "መርካቶ ተራ፣ አዲስ አበባ",
    rulesSummary: "ለቢዝነስ መስፋፊያ የታለመ። የባንክ ወይም የቴሌብር ክፍያ ብቻ ይቀበላል።",
    isVerified: true,
  },
  {
    id: "eq-tech-03",
    name: "የቴክኖሎጂ ባለሙያዎች ዕቁብ (Addis Tech Circle)",
    category: "workplace",
    categoryLabel: "የስራ ቦታ • Workplace",
    membersCount: 22,
    maxMembers: 25,
    monthlyAmount: 15000,
    frequency: "በየወሩ (Monthly)",
    payoutMethod: "በተራ ዙር (Fixed Rotation)",
    location: "ካዛንቺስ፣ አዲስ አበባ",
    rulesSummary: "የወርሃዊ ደመወዝ ተቀናሽ። ዲጂታል ማረጋገጫ ብቻ ይፈቀዳል።",
    isVerified: true,
  },
  {
    id: "eq-family-04",
    name: "የቤተሰብና የዘመድ የጋራ ዕቁብ (Family Circle)",
    category: "family",
    categoryLabel: "የቤተሰብ • Family",
    membersCount: 15,
    maxMembers: 15,
    monthlyAmount: 3000,
    frequency: "በየወሩ (Monthly)",
    payoutMethod: "በዕጣ (Lottery)",
    location: "አዲስ አበባ / ዲያስፖራ የቤተሰብ አባላት",
    rulesSummary: "ለአስቸኳይ ፍላጎት ቅድሚያ የሚሰጥ የቤተሰብ መረዳጃ ክበብ።",
    isVerified: true,
  },
];

export const ExploreEqubsView: React.FC<ExploreEqubsViewProps> = ({
  t,
  onCreateEqub,
}) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = SAMPLE_COMMUNITY_EQUBS.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || eq.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleJoinRequest = (eq: CommunityEqub) => {
    Alert.alert(
      t.joinSuccessTitle,
      `የ${eq.name} የመቀላቀል ጥያቄ ለአዘጋጁ ተልኳል። አዘጋጁ የዕቁቡን ህገ-ደንብ ካረጋገጠ በኋላ ምላሽ ይሰጥዎታል።`,
      [{ text: t.confirm, style: "default" }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Editorial Header Banner with Cultural Photo */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require("../assets/equb-gathering.jpg")}
          style={styles.bannerImage}
          imageStyle={styles.bannerImageStyle}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>{t.exploreTitle}</Text>
            <Text style={styles.bannerSubtitle}>{t.exploreSubtitle}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={Palette.textMuted}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {[
          { id: "all", label: t.filterAll },
          { id: "neighborhood", label: t.filterNeighborhood },
          { id: "merchant", label: t.filterMerchant },
          { id: "workplace", label: t.filterWorkplace },
          { id: "family", label: t.filterFamily },
        ].map((f) => {
          const isSelected = activeFilter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setActiveFilter(f.id)}
              style={[
                styles.filterChip,
                isSelected && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Equb Cards List */}
      <View style={styles.cardsList}>
        {filtered.map((eq) => {
          const isFull = eq.membersCount >= eq.maxMembers;
          return (
            <View key={eq.id} style={styles.equbCard}>
              {/* Category & Verified Badge */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{eq.categoryLabel}</Text>
                </View>
                {eq.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>✓ የታመነ ክበብ</Text>
                  </View>
                )}
              </View>

              {/* Title & Location */}
              <Text style={styles.cardTitle}>{eq.name}</Text>
              <Text style={styles.cardLocation}>📍 {eq.location}</Text>

              {/* Financial & Member Metrics */}
              <View style={styles.metricsBox}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>ወርሃዊ ክፍያ</Text>
                  <Text style={styles.metricAmount}>
                    {money(eq.monthlyAmount)}
                  </Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>የአባላት ብዛት</Text>
                  <Text style={styles.metricValue}>
                    {eq.membersCount}/{eq.maxMembers}
                  </Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>የምደባ ዘዴ</Text>
                  <Text style={styles.metricValue} numberOfLines={1}>
                    {eq.payoutMethod}
                  </Text>
                </View>
              </View>

              {/* Rules summary note */}
              <View style={styles.rulesContainer}>
                <Text style={styles.rulesLabel}>{t.groupRulesHeading}:</Text>
                <Text style={styles.rulesBody}>{eq.rulesSummary}</Text>
              </View>

              {/* Action Button */}
              <View style={styles.cardActionRow}>
                <Pressable
                  onPress={() => handleJoinRequest(eq)}
                  style={({ pressed }) => [
                    styles.joinBtn,
                    isFull && styles.joinBtnFull,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Text style={styles.joinBtnText}>
                    {isFull ? "አባላት ሞልቷል (ተጠባባቂ ይሁኑ)" : t.joinRequest}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⌕</Text>
            <Text style={styles.emptyTitle}>ምንም ዕቁብ አልተገኘም</Text>
            <Text style={styles.emptySubtitle}>
              የተለየ ቃል ሞክረው ይፈልጉ ወይም አዲስ የዕቁብ ክበብ ይፍጠሩ።
            </Text>
            <Pressable onPress={onCreateEqub} style={styles.createAltBtn}>
              <Text style={styles.createAltText}>＋ {t.ctaCreateEqub}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.hero,
  },
  bannerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  bannerImage: {
    borderRadius: Radii.lg,
    overflow: "hidden",
    minHeight: 120,
    ...Shadows.subtle,
  },
  bannerImageStyle: {
    borderRadius: Radii.lg,
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(23, 43, 67, 0.82)",
    padding: Spacing.lg,
    justifyContent: "center",
  },
  bannerTitle: {
    color: Palette.surfaceWhite,
    fontSize: 20,
    fontWeight: "800",
  },
  bannerSubtitle: {
    color: "#E2E8F0",
    fontSize: 11.5,
    marginTop: 4,
    lineHeight: 16,
  },
  searchContainer: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    ...Shadows.subtle,
  },
  searchIcon: {
    color: Palette.textMuted,
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: Palette.midnightNavy,
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    color: Palette.textMuted,
    fontSize: 12,
  },
  filterBar: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  filterChip: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: Palette.midnightNavy,
    borderColor: Palette.midnightNavy,
  },
  filterText: {
    color: Palette.textSecondary,
    fontSize: 11.5,
    fontWeight: "600",
  },
  filterTextActive: {
    color: Palette.surfaceWhite,
    fontWeight: "800",
  },
  cardsList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  equbCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  categoryPill: {
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  categoryPillText: {
    color: Palette.midnightNavy,
    fontSize: 10,
    fontWeight: "700",
  },
  verifiedBadge: {
    backgroundColor: Palette.confirmedGreenSurface,
    borderColor: Palette.confirmedGreenBorder,
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedBadgeText: {
    color: Palette.confirmedGreen,
    fontSize: 9,
    fontWeight: "800",
  },
  cardTitle: {
    color: Palette.midnightNavy,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  cardLocation: {
    color: Palette.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  metricsBox: {
    flexDirection: "row",
    backgroundColor: Palette.neutralSurface,
    borderRadius: Radii.md,
    padding: Spacing.sm + 2,
    marginVertical: Spacing.md,
    alignItems: "center",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: Palette.neutralBorder,
  },
  metricLabel: {
    color: Palette.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  metricAmount: {
    color: Palette.royalBlue,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },
  metricValue: {
    color: Palette.midnightNavy,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  rulesContainer: {
    backgroundColor: "#FBF9F4",
    borderLeftWidth: 3,
    borderLeftColor: Palette.wovenGold,
    padding: Spacing.sm,
    borderRadius: Radii.xs,
    marginBottom: Spacing.md,
  },
  rulesLabel: {
    color: Palette.wovenGoldDark,
    fontSize: 10,
    fontWeight: "700",
  },
  rulesBody: {
    color: Palette.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 2,
  },
  cardActionRow: {
    marginTop: Spacing.xs,
  },
  joinBtn: {
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  joinBtnFull: {
    backgroundColor: Palette.midnightNavy,
  },
  joinBtnText: {
    color: Palette.surfaceWhite,
    fontSize: 12.5,
    fontWeight: "800",
  },
  emptyContainer: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.neutralBorder,
    padding: Spacing.hero,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 32,
    color: Palette.textMuted,
  },
  emptyTitle: {
    color: Palette.midnightNavy,
    fontSize: 15,
    fontWeight: "800",
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    color: Palette.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  createAltBtn: {
    marginTop: Spacing.md,
    backgroundColor: Palette.royalBlue,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 9,
  },
  createAltText: {
    color: Palette.surfaceWhite,
    fontSize: 12,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.85,
  },
});
