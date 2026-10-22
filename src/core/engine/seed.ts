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
    customerNumber: `EQ-${String(i + 1).padStart(4, "0")}`,
    idNumber: `DEMO-ID-${String(i + 1).padStart(4, "0")}`,
    phone: `09${String(10000000 + i * 13791).slice(0, 8)}`,
    joinedAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    status: "active" as const,
  }));
  const cycleId = `cycle-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
      participantMemberIds: members.map((member) => member.id),
    }],
    payouts: [],
    draws: [],
    currentRotation: 1,
  };
}
