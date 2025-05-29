import React, { useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  List,
  IconButton,
  Portal,
  Modal,
  TextInput,
  Button,
  Divider,
  Provider,
  Chip,
  Surface,
  Text,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Define the type for a class item
interface ClassItem {
  id: number;
  name: string;
  students: number;
  lastAttendance: string;
  subject?: string;
  color?: string;
}

const Classes = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: 1,
      name: "Toán Cao Cấp A1",
      students: 35,
      lastAttendance: "29/05/2025 08:00",
      subject: "Toán học",
      color: "#FF6B6B",
    },
    {
      id: 2,
      name: "Lập Trình Web",
      students: 28,
      lastAttendance: "29/05/2025 10:00",
      subject: "Công nghệ",
      color: "#4ECDC4",
    },
    {
      id: 3,
      name: "Cơ Sở Dữ Liệu",
      students: 32,
      lastAttendance: "28/05/2025 14:00",
      subject: "Công nghệ",
      color: "#45B7D1",
    },
    {
      id: 4,
      name: "Mạng Máy Tính",
      students: 25,
      lastAttendance: "28/05/2025 16:00",
      subject: "Công nghệ",
      color: "#96CEB4",
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassStudents, setNewClassStudents] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNewClass = () => {
    if (!newClassName || !newClassStudents) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FECA57",
      "#FF9FF3",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newClass: ClassItem = {
      id: classes.length + 1,
      name: newClassName,
      students: parseInt(newClassStudents),
      lastAttendance: "Chưa điểm danh",
      subject: newClassSubject || "Chung",
      color: randomColor,
    };

    setClasses([...classes, newClass]);
    setNewClassName("");
    setNewClassStudents("");
    setNewClassSubject("");
    setModalVisible(false);
  };

  const handleAttendance = (classId: number) => {
    // Sửa lỗi routing - sử dụng đúng cú pháp dynamic route
    try {
      // Cách 1: Relative path (nếu đang trong (tabs) layout)
      router.push(`/attendance/${classId}`);

      // Nếu cách 1 không work, thử cách 2:
      // router.push({
      //   pathname: "/attendance/[classId]",
      //   params: { classId: classId.toString() }
      // });

      // Nếu cách 2 không work, thử cách 3:
      // router.push(`/(tabs)/attendance/${classId}`);
    } catch (error) {
      console.log("Navigation error:", error);
      alert("Không thể chuyển đến trang điểm danh");
    }
  };

  const renderClassItem = ({ item }: { item: ClassItem }) => (
    <Card style={[styles.classCard, { borderLeftColor: item.color }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleSection}>
            <Text style={styles.className}>{item.name}</Text>
            <Chip
              style={[
                styles.subjectChip,
                { backgroundColor: item.color + "20" },
              ]}
              textStyle={{ color: item.color, fontSize: 12 }}
            >
              {item.subject}
            </Chip>
          </View>
          <View style={[styles.studentsBadge, { backgroundColor: item.color }]}>
            <Text style={styles.studentsCount}>{item.students}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color="#666"
            />
            <Text style={styles.infoText}>{item.students} học sinh</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="#666"
            />
            <Text style={styles.infoText}>
              {item.lastAttendance === "Chưa điểm danh"
                ? "Chưa điểm danh"
                : `Lần cuối: ${item.lastAttendance}`}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <IconButton
            icon="check-circle"
            size={22}
            iconColor={item.color}
            style={[
              styles.actionButton,
              { backgroundColor: item.color + "15" },
            ]}
            onPress={() => handleAttendance(item.id)}
          />
          <IconButton
            icon="pencil"
            size={22}
            iconColor="#666"
            style={[styles.actionButton, { backgroundColor: "#f0f0f0" }]}
            onPress={() => console.log(`Edit ${item.name}`)}
          />
          <IconButton
            icon="eye"
            size={22}
            iconColor="#666"
            style={[styles.actionButton, { backgroundColor: "#f0f0f0" }]}
            onPress={() => console.log(`View details for ${item.name}`)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header với gradient */}
        <Surface style={styles.header} elevation={2}>
          <Text style={styles.headerTitle}>Quản lý lớp học</Text>
          <Text style={styles.headerSubtitle}>
            {filteredClasses.length} lớp học đang hoạt động
          </Text>
        </Surface>

        {/* Search bar được cải thiện */}
        <Searchbar
          placeholder="Tìm kiếm lớp học..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#666"
        />

        {/* Statistics cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="school" size={24} color="#4ECDC4" />
              <Text style={styles.statNumber}>{classes.length}</Text>
              <Text style={styles.statLabel}>Tổng lớp</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#FF6B6B"
              />
              <Text style={styles.statNumber}>
                {classes.reduce((sum, cls) => sum + cls.students, 0)}
              </Text>
              <Text style={styles.statLabel}>Học sinh</Text>
            </Card.Content>
          </Card>
        </View>

        <FlatList
          data={filteredClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
        <IconButton
          icon="plus"
          size={28}
          iconColor="white"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />

        {/* Improved Modal */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Title style={styles.modalTitle}>Thêm lớp học mới</Title>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>

            <TextInput
              label="Tên lớp học"
              value={newClassName}
              onChangeText={setNewClassName}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="book" />}
            />

            <TextInput
              label="Môn học"
              value={newClassSubject}
              onChangeText={setNewClassSubject}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="school" />}
            />

            <TextInput
              label="Số học sinh"
              value={newClassStudents}
              onChangeText={setNewClassStudents}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account-group" />}
            />

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                Hủy
              </Button>
              <Button
                mode="contained"
                onPress={addNewClass}
                style={styles.addClassButton}
              >
                Thêm lớp
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  searchBar: {
    margin: 16,
    marginTop: 20,
    elevation: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  searchInput: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
    borderRadius: 12,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
  },
  classCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "#fff",
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitleSection: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
  },
  subjectChip: {
    alignSelf: "flex-start",
  },
  studentsBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: "center",
  },
  studentsCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    margin: 0,
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#4ECDC4",
    borderRadius: 28,
    elevation: 8,
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  input: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  cancelButton: {
    borderColor: "#bdc3c7",
  },
  addClassButton: {
    backgroundColor: "#4ECDC4",
  },
});

export default Classes