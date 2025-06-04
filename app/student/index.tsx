import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, Button, Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define type for a class
interface ClassSchedule {
  id: number;
  classId: string;
  subject: string;
  time: string;
  room: string;
}

const StudentClassesScreen = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassSchedule[]>([]);

  // Mock data: Lớp học của sinh viên trong ngày hiện tại
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10); // Lấy ngày hiện tại (YYYY-MM-DD)
    const mockClasses: ClassSchedule[] = [
      {
        id: 1,
        classId: "1",
        subject: "Toán Cao Cấp",
        time: "08:00 - 10:00",
        room: "A101",
      },
      {
        id: 2,
        classId: "2",
        subject: "Lập trình di động",
        time: "10:30 - 12:30",
        room: "B202",
      },
    ];
    // Lọc lớp học trong ngày hiện tại (giả lập)
    setClasses(mockClasses);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isAuthenticated");
    await AsyncStorage.removeItem("userRole");
    router.replace("/start_screen/login");
  };

  const renderClassItem = ({ item }: { item: ClassSchedule }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.time}>Thời gian: {item.time}</Text>
        <Text style={styles.room}>Phòng: {item.room}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => router.push(`/student/student_attendance/${item.classId}`)}
          style={styles.button}
        >
          Điểm danh
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Lớp học hôm nay" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <FlatList
        data={classes}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Không có lớp học nào hôm nay.</Text>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  room: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    borderRadius: 12,
    backgroundColor: "#2196F3",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default StudentClassesScreen;
