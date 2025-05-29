import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Avatar } from "react-native-paper";

interface CardType {
  totalClasses: number;
  totalStudents: number;
  todayAttendance: number;
  totalSessions: number;
}

interface CardProps {
  stats: CardType;
}

const StatCard: React.FC<CardProps> = ({ stats }) => (
  <View style={styles.statsContainer}>
    <View style={styles.statsRow}>
      <Card style={[styles.statCard, { backgroundColor: "#E3F2FD" }]}>
        <Card.Content style={styles.statContent}>
          <View style={styles.statHeader}>
            <Avatar.Icon
              size={40}
              icon="book-open-variant"
              style={{ backgroundColor: "#1976D2" }}
            />
            <Title style={[styles.statNumber, { color: "#1976D2" }]}>
              {stats.totalClasses}
            </Title>
          </View>
          <Paragraph style={styles.statLabel}>Lớp học</Paragraph>
        </Card.Content>
      </Card>
      <Card style={[styles.statCard, { backgroundColor: "#E8F5E8" }]}>
        <Card.Content style={styles.statContent}>
          <View style={styles.statHeader}>
            <Avatar.Icon
              size={40}
              icon="account-group"
              style={{ backgroundColor: "#4CAF50" }}
            />
            <Title style={[styles.statNumber, { color: "#4CAF50" }]}>
              {stats.totalStudents}
            </Title>
          </View>
          <Paragraph style={styles.statLabel}>Học sinh</Paragraph>
        </Card.Content>
      </Card>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsContainer: { marginBottom: 24 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: { flex: 1, marginHorizontal: 4, elevation: 3 },
  statContent: { alignItems: "center", paddingVertical: 12 },
  statHeader: { alignItems: "center", marginBottom: 8 },
  statNumber: { fontSize: 24, fontWeight: "bold", marginTop: 8 },
  statLabel: { fontSize: 14, color: "#666", textAlign: "center" },
});

export default StatCard;
