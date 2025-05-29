import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Text } from "react-native-paper";

interface QuickCardType{ 
    title: string;
    count: number; 
    color: string 
}
interface QuickCardProps {
  stats: QuickCardType[];
}

const QuickStatCard: React.FC<QuickCardProps> = ({ stats }) => (
  <View style={styles.quickStatsContainer}>
    <Text style={styles.sectionTitle}>Thống kê nhanh</Text>
    <View style={styles.quickStatsRow}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          style={[
            styles.quickStatCard,
            { borderLeftColor: stat.color, borderLeftWidth: 4 },
          ]}
        >
          <Card.Content style={styles.quickStatContent}>
            <Title style={[styles.quickStatNumber, { color: stat.color }]}>
              {stat.count}
            </Title>
            <Paragraph style={styles.quickStatLabel}>{stat.title}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  quickStatsContainer: { marginBottom: 24 },
  quickStatsRow: { flexDirection: "row", justifyContent: "space-between" },
  quickStatCard: { flex: 1, marginHorizontal: 4, elevation: 2 },
  quickStatContent: { alignItems: "center", paddingVertical: 16 },
  quickStatNumber: { fontSize: 20, fontWeight: "bold" },
  quickStatLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
});

export default QuickStatCard;
