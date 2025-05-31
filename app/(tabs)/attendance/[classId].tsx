import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Appbar,
  Searchbar,
  List,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Text,
  Card,
  Button,
  Surface,
  Badge,
  TextInput,
  Dialog,
  Portal,
} from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import NetInfo from "@react-native-community/netinfo";

// Define the type for a student
interface Student {
  id: number;
  studentId: string;
  name: string;
  avatar: string;
  attendanceStatus: "present" | "absent" | "not_taken";
  email?: string;
  phone?: string;
}

// Mock data for students with additional info
const mockStudents: Record<number, Student[]> = {
  1: [
    {
      id: 1,
      studentId: "SV001",
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      attendanceStatus: "not_taken",
      email: "nguyenvana@email.com",
      phone: "0123456789",
    },
    {
      id: 2,
      studentId: "SV002",
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      attendanceStatus: "not_taken",
      email: "tranthib@email.com",
      phone: "0987654321",
    },
    {
      id: 3,
      studentId: "SV003",
      name: "Lê Văn C",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      attendanceStatus: "not_taken",
      email: "levanc@email.com",
      phone: "0369852147",
    },
  ],
  2: [
    {
      id: 4,
      studentId: "SV004",
      name: "Phạm Thị D",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      attendanceStatus: "not_taken",
      email: "phamthid@email.com",
      phone: "0147258369",
    },
    {
      id: 5,
      studentId: "SV005",
      name: "Hoàng Văn E",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      attendanceStatus: "not_taken",
      email: "hoangvane@email.com",
      phone: "0258147963",
    },
  ],
  3: [
    {
      id: 6,
      studentId: "SV006",
      name: "Ngô Thị F",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      attendanceStatus: "not_taken",
      email: "ngothif@email.com",
      phone: "0741852963",
    },
    {
      id: 7,
      studentId: "SV007",
      name: "Đinh Văn G",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      attendanceStatus: "not_taken",
      email: "dinhvang@email.com",
      phone: "0963741852",
    },
  ],
  4: [
    {
      id: 8,
      studentId: "SV008",
      name: "Bùi Thị H",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      attendanceStatus: "not_taken",
      email: "buithih@email.com",
      phone: "0852963741",
    },
    {
      id: 9,
      studentId: "SV009",
      name: "Vũ Văn I",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      attendanceStatus: "not_taken",
      email: "vuvani@email.com",
      phone: "0159753486",
    },
  ],
};

const Attendance = () => {
  const { classId } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [showStats, setShowStats] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const id = parseInt(classId as string);
    const classStudents = mockStudents[id] || [];
    setStudents(classStudents);
  }, [classId]);

  // Get current IP using NetInfo
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setCurrentIp(state.type === 'wifi' && 'ipAddress' in (state.details ?? {}) ? (state.details as any).ipAddress : 'Unknown');
    });

    NetInfo.fetch().then((state) => {
      setCurrentIp(state.type === 'wifi' && 'ipAddress' in (state.details ?? {}) ? (state.details as any).ipAddress : 'Unknown');
    });

    return () => unsubscribe();
  }, []);

  const calculateExpiryTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  
  const vietnamTime = now.toLocaleString('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  return vietnamTime.replace(' ', ' ');
};
  
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate attendance statistics
  const totalStudents = students.length;
  const presentStudents = students.filter(
    (s) => s.attendanceStatus === "present"
  ).length;
  const absentStudents = students.filter(
    (s) => s.attendanceStatus === "absent"
  ).length;
  const notTakenStudents = students.filter(
    (s) => s.attendanceStatus === "not_taken"
  ).length;

  const updateAttendance = (studentId: number, status: "present" | "absent") => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, attendanceStatus: status }
          : student
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return "check-circle";
      case "absent":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "#4CAF50";
      case "absent":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  const renderStudentItem = ({ item, index }: { item: Student; index: number }) => (
    <Card style={[styles.studentCard, { marginTop: index === 0 ? 8 : 4 }]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
              onError={() => console.log(`Failed to load avatar for ${item.name}`)}
            />
            <Badge
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.attendanceStatus) },
              ]}
              size={12}
            />
          </View>
          <View style={styles.textInfo}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentId}>{item.studentId}</Text>
            <Text style={styles.studentEmail}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Surface style={styles.statusContainer} elevation={1}>
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.attendanceStatus) },
              ]}
            >
              {item.attendanceStatus === "present"
                ? "Có mặt"
                : item.attendanceStatus === "absent"
                ? "Vắng mặt"
                : "Chưa điểm danh"}
            </Text>
          </Surface>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.presentButton,
                item.attendanceStatus === "present" && styles.activeButton,
              ]}
              onPress={() => updateAttendance(item.id, "present")}
            >
              <IconButton
                icon="check"
                size={18}
                iconColor={
                  item.attendanceStatus === "present" ? "#FFF" : "#4CAF50"
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.absentButton,
                item.attendanceStatus === "absent" && styles.activeButton,
              ]}
              onPress={() => updateAttendance(item.id, "absent")}
            >
              <IconButton
                icon="close"
                size={18}
                iconColor={
                  item.attendanceStatus === "absent" ? "#FFF" : "#F44336"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderHeader = () => (
    <View>
      <Searchbar
        placeholder="Tìm kiếm sinh viên theo tên hoặc mã số..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#6200EE"
      />

      {showStats && (
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Thống kê điểm danh</Text>
              <IconButton
                icon={showStats ? "chevron-up" : "chevron-down"}
                size={20}
                onPress={() => setShowStats(!showStats)}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Surface
                  style={[styles.statCircle, { backgroundColor: "#E3F2FD" }]}
                  elevation={2}
                >
                  <Text style={[styles.statNumber, { color: "#1976D2" }]}>
                    {totalStudents}
                  </Text>
                </Surface>
                <Text style={styles.statLabel}>Tổng số</Text>
              </View>

              <View style={styles.statItem}>
                <Surface
                  style={[styles.statCircle, { backgroundColor: "#E8F5E8" }]}
                  elevation={2}
                >
                  <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
                    {presentStudents}
                  </Text>
                </Surface>
                <Text style={styles.statLabel}>Có mặt</Text>
              </View>

              <View style={styles.statItem}>
                <Surface
                  style={[styles.statCircle, { backgroundColor: "#FFEBEE" }]}
                  elevation={2}
                >
                  <Text style={[styles.statNumber, { color: "#F44336" }]}>
                    {absentStudents}
                  </Text>
                </Surface>
                <Text style={styles.statLabel}>Vắng mặt</Text>
              </View>

              <View style={styles.statItem}>
                <Surface
                  style={[styles.statCircle, { backgroundColor: "#FFF8E1" }]}
                  elevation={2}
                >
                  <Text style={[styles.statNumber, { color: "#FF9800" }]}>
                    {notTakenStudents}
                  </Text>
                </Surface>
                <Text style={styles.statLabel}>Chưa điểm danh</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        style={styles.generateQrButton}
        onPress={() => setQrVisible(true)}
      >
        Tạo mã QR
      </Button>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Button
        mode="contained"
        style={styles.saveButton}
        labelStyle={styles.saveButtonText}
        onPress={() => {
          console.log("Saving attendance...");
        }}
      >
        Lưu điểm danh
      </Button>
    </View>
  );

  const generateQRCode = () => {
    if (!currentIp) {
      Alert.alert("Lỗi", "Không thể lấy địa chỉ IP hiện tại. Vui lòng thử lại.");
      return;
    }
    const expiryTime = calculateExpiryTime();
    const qrData = {
      classId: classId,
      ipAddress: currentIp,
      expiryTime: expiryTime,
    };
    setQrValue(JSON.stringify(qrData));
    setQrVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconButton icon="account-search" size={48} iconColor="#BDBDBD" />
              <Text style={styles.emptyText}>Không tìm thấy sinh viên</Text>
              <Text style={styles.emptySubtext}>
                Thử tìm kiếm với từ khóa khác
              </Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Portal>
        <Dialog visible={qrVisible} onDismiss={() => setQrVisible(false)}>
          <Dialog.Title>Tạo mã QR</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.qrInfo}>Thời gian hết hạn: {calculateExpiryTime()}</Text>
            {qrValue && (
              <View style={styles.qrContainer}>
                <QRCode value={qrValue} size={200} />
                <Text style={styles.qrText}>Quét mã QR này để điểm danh</Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={generateQRCode}>Tạo mã</Button>
            <Button onPress={() => setQrVisible(false)}>Đóng</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 100,
  },
  studentCard: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  statusBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 12,
    color: "#999",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 0,
    margin: 0,
  },
  presentButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#FFFFFF",
  },
  absentButton: {
    borderColor: "#F44336",
    backgroundColor: "#FFFFFF",
  },
  activeButton: {
    backgroundColor: "#4CAF50",
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 4,
    backgroundColor: "#4ECDC4",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 1,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  generateQrButton: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#2196F3",
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  qrText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  qrInfo: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
});

export default Attendance;