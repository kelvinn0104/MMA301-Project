import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Chip,
  List,
  Divider,
  IconButton,
  Surface
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ClassItemType {
  id: number;
  name: string;
  students: number;
  time: string;
  attendanceRate: number;
  status: "completed" | "upcoming";
}

interface ClassItemProps {
  classes: ClassItemType[];
}

const ClassItem: React.FC<ClassItemProps> = ({ classes }) => (
  <Card style={styles.recentClassesCard}>
    <Card.Content>
      <View style={styles.sectionHeader}>
        <Title style={styles.cardTitle}>Lớp học hôm nay</Title>
        <Chip mode="outlined" compact>
          Hôm nay
        </Chip>
      </View>
      {classes.map((classItem, index) => (
        <View key={classItem.id}>
          <List.Item
            title={classItem.name}
            description={`${classItem.students} học sinh • ${classItem.time}`}
            titleStyle={styles.classTitle}
            descriptionStyle={styles.classDescription}
            left={(props) => (
              <Surface
                style={[
                  styles.classIcon,
                  {
                    backgroundColor:
                      classItem.status === "completed" ? "#E8F5E8" : "#FFF3E0",
                  },
                ]}
              >
                <IconButton
                  {...props}
                  icon={
                    classItem.status === "completed"
                      ? "check-circle"
                      : "clock-outline"
                  }
                  size={25}
                //   color={
                //     classItem.status === "completed" ? "#4CAF50" : "#FF9800"
                //   }
                />
              </Surface>
            )}
            right={(props) => (
              <View style={styles.classRight}>
                {classItem.status === "completed" && (
                  <Chip
                    mode="flat"
                    compact
                    style={{ backgroundColor: "#E8F5E8", marginRight: 8 }}
                    textStyle={{ color: "#4CAF50", fontSize: 12 }}
                  >
                    {classItem.attendanceRate}%
                  </Chip>
                )}
                <IconButton
                  {...props}
                  icon="chevron-right"
                  size={20}
                  onPress={() => console.log("Navigate to class")}
                />
              </View>
            )}
            onPress={() => console.log(`Open class ${classItem.name}`)}
            style={styles.classItem}
          />
          {index < classes.length - 1 && <Divider />}
        </View>
      ))}
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  recentClassesCard: { marginBottom: 24, elevation: 3 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  classIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  classTitle: { fontSize: 16, fontWeight: "600" },
  classDescription: { fontSize: 14, color: "#666" },
  classRight: { flexDirection: "row", alignItems: "center" },
  classItem: { paddingVertical: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
});

export default ClassItem;
