import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Avatar, Paragraph, Title, Surface } from "react-native-paper";

const { width } = Dimensions.get("window");

const QuickAction = () => (
  <Card style={styles.quickActionsCard}>
    <Card.Content>
      <Title style={styles.cardTitle}>Thao tác nhanh</Title>
      <View style={styles.quickActions}>
        <Surface
          style={[styles.quickAction, { backgroundColor: "#E3F2FD" }]}
          onTouchEnd={() => console.log("New Class")}
        >
          <Avatar.Icon
            size={48}
            icon="plus"
            style={{ backgroundColor: "#1976D2" }}
          />
          <Paragraph style={styles.quickActionLabel}>Tạo lớp mới</Paragraph>
        </Surface>
        <Surface
          style={[styles.quickAction, { backgroundColor: "#E8F5E8" }]}
          onTouchEnd={() => console.log("Import Students")}
        >
          <Avatar.Icon
            size={48}
            icon="upload"
            style={{ backgroundColor: "#4CAF50" }}
          />
          <Paragraph style={styles.quickActionLabel}>Import học sinh</Paragraph>
        </Surface>
        <Surface
          style={[styles.quickAction, { backgroundColor: "#FFF3E0" }]}
          onTouchEnd={() => console.log("View Reports")}
        >
          <Avatar.Icon
            size={48}
            icon="chart-line"
            style={{ backgroundColor: "#F57C00" }}
          />
          <Paragraph style={styles.quickActionLabel}>Xem báo cáo</Paragraph>
        </Surface>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  quickActionsCard: { elevation: 3, marginBottom: 24 },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    alignSelf: "stretch",
  },
  quickAction: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    minWidth: (width - 80) / 3,
  },
  quickActionLabel: {
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    lineHeight: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
});

export default QuickAction;
