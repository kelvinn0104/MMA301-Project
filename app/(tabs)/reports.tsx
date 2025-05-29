// app/(tabs)/Reports.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Title, Paragraph } from "react-native-paper";

const Reports = () => (
  <View style={styles.centerContent}>
    <Avatar.Icon size={80} icon="school" style={styles.placeholderIcon} />
    <Title style={styles.placeholderTitle}>Danh sách lớp học</Title>
    <Paragraph style={styles.placeholderText}>
      Chức năng đang phát triển
    </Paragraph>
  </View>
);

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  placeholderIcon: { backgroundColor: "#E0E0E0", marginBottom: 16 },
  placeholderTitle: { marginBottom: 8 },
  placeholderText: { textAlign: "center", color: "#757575" },
});

export default Reports;

// app/(tabs)/reports.tsx và settings.tsx tương tự, chỉ thay icon và title
