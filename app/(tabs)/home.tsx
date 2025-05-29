import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import StatCard from "../../components/StatCard";
import AttendanceCard from "../../components/AttendanceCard";
import QuickStatCard from "../../components/QuickStatCard";
import ClassItem from "../../components/ClassItem";
import QuickAction from "../../components/QuickAction";

interface ClassItemType {
  id: number;
  name: string;
  students: number;
  time: string;
  attendanceRate: number;
  status: "completed" | "upcoming";
}

interface CardType {
  totalClasses: number;
  totalStudents: number;
  todayAttendance: number;
  totalSessions: number;
}

interface QuickCardType {
  title: string;
  count: number;
  color: string;
}

const Home = () => {
  const dashboardStats: CardType = {
    totalClasses: 8,
    totalStudents: 245,
    todayAttendance: 89.2,
    totalSessions: 156,
  };

  const recentClasses: ClassItemType[] = [
    {
      id: 1,
      name: "Toán Cao Cấp A1",
      students: 35,
      time: "08:00",
      attendanceRate: 94.3,
      status: "completed",
    },
    {
      id: 2,
      name: "Lập Trình Web",
      students: 28,
      time: "10:00",
      attendanceRate: 89.3,
      status: "completed",
    },
    {
      id: 3,
      name: "Cơ Sở Dữ Liệu",
      students: 32,
      time: "14:00",
      attendanceRate: 0,
      status: "upcoming",
    },
    {
      id: 4,
      name: "Mạng Máy Tính",
      students: 25,
      time: "16:00",
      attendanceRate: 0,
      status: "upcoming",
    },
  ] as const;

  const quickStats: QuickCardType[] = [
    { title: "Có mặt", count: 218, color: "#4CAF50" },
    { title: "Vắng mặt", count: 15, color: "#F44336" },
    { title: "Muộn", count: 12, color: "#FF9800" },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <StatCard stats={dashboardStats} />
      <AttendanceCard stats={dashboardStats} />
      <QuickStatCard stats={quickStats} />
      <ClassItem classes={recentClasses} />
      <QuickAction />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 100 },
});

export default Home;
