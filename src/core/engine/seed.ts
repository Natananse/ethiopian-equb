import type { EqubState } from "./types";

const names = [
  "Abebe Kebede", "Hana Tesfaye", "Dawit Alemu", "Selamawit Bekele", "Yohannes Tadesse",
  "Mekdes Girma", "Bereket Worku", "Rahel Getachew", "Samuel Assefa", "Liya Demissie",
  "Henok Fikru", "Mimi Solomon", "Daniel Abate", "Eden Kassahun", "Mulugeta Kassa",
  "Saron Abebe", "Tewodros Belay", "Meron Nigatu", "Fitsum Kebede", "Hirut Desta",
  "Natnael Bekele", "Bethlehem Tola", "Kalkidan Fenta", "Robel Alemayehu", "Tigist Worku",
  "Biruk Mekonnen", "Mahlet Yimer", "Solomon Dinku", "Yared Hailu", "Frehiwot Assefa",
  "Kebede Mamo", "Selam Girma", "Abel Teshome", "Eyerusalem Getu", "Fasil Tesfaye",
  "Marta Wondimu", "Tamrat Bekele", "Genet Abate", "Eyob Kassahun", "Hana Getachew"
];

export function createDemoState(): EqubState {
  const now = new Date();
  const members = names.map((name, i) => ({
    id: `member-${i + 1}`,
    name,
    phone: `09${String(10000000 + i * 13791).slice(0, 8)}`,
    joinedAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    status: "active" as const,
  }));
  const cycleId = "cycle-2026-10";
  const dueDate = new Date(now.getFullYear(), now.getMonth(), 25).toISOString();
  const contributions = members.slice(0, 8).map((member, i) => ({
    id: `demo-payment-${i + 1}`,
    memberId: member.id,
    cycleId,
    amount: 5000,
    paidAt: new Date(now.getFullYear(), now.getMonth(), Math.min(i + 1, 12)).toISOString(),
    status: "confirmed" as const,
    note: "Demo transaction",
  }));
  return {
    groupName: "የእኩብ ቡድን",
    currency: "ETB",
    contributionAmount: 5000,
    frequency: "monthly",
    members,
    contributions,
    cycles: [{
      id: cycleId,
      label: `${now.toLocaleString("en-US", { month: "long" })} ${now.getFullYear()}`,
      dueDate,
      contributionAmount: 5000,
      status: "active",
      recipientMemberId: members[0].id,
    }],
    payouts: [{
      id: "payout-demo-1",
      cycleId,
      recipientMemberId: members[0].id,
      grossAmount: 200000,
      deductions: 0,
      netAmount: 200000,
      status: "scheduled",
      evidenceNote: "Demo only — not an actual transfer",
    }],
  };
}
