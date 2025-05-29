import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  ProgressBar,
} from "react-native-paper";

interface CardType {
  totalClasses: number;
  totalStudents: number;
  todayAttendance: number;
  totalSessions: number;
}

interface CardProps {
  stats: CardType;
}

const AttendanceCard: React.FC<CardProps> = ({ stats }) => (
  <Card style={[styles.attendanceCard, { backgroundColor: "#FFF3E0" }]}>
    <Card.Content>
      <View style={styles.attendanceHeader}>
        <View style={styles.attendanceInfo}>
          <Title style={[styles.attendanceRate, { color: "#F57C00" }]}>
            {stats.todayAttendance}%
          </Title>
          <Paragraph style={styles.attendanceLabel}>
            Tỷ lệ điểm danh hôm nay
          </Paragraph>
        </View>
        <Avatar.Icon
          size={50}
          icon="trending-up"
          style={{ backgroundColor: "#F57C00" }}
        />
      </View>
      <ProgressBar
        progress={stats.todayAttendance / 100}
        color="#F57C00"
        style={styles.progressBar}
      />
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  attendanceCard: { elevation: 3, marginBottom: 24 },
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  attendanceInfo: { flex: 1 },
  attendanceRate: { fontSize: 32, fontWeight: "bold" },
  attendanceLabel: { fontSize: 14, color: "#666", marginTop: 4 },
  progressBar: { height: 8, borderRadius: 4 },
});

export default AttendanceCard;
