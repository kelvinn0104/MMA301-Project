import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Card,
  Avatar,
  Menu,
  Divider,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

interface Role {
    value: string,
    label: string,
    icon: string
}

const RegisterScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    studentImage: null,
    role: "student", // default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);

  const roles = [
    { value: "student", label: "Sinh viên", icon: "school" },
    { value: "teacher", label: "Giáo viên", icon: "account-tie" },
    { value: "admin", label: "Quản trị viên", icon: "shield-account" },
  ];

  const handleInputChange = (field:string, value:string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Thông báo",
          "Cần quyền truy cập thư viện ảnh để chọn ảnh."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        handleInputChange("studentImage", result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Thông báo", "Cần quyền truy cập camera để chụp ảnh.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        handleInputChange("studentImage", result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Chọn ảnh", "Bạn muốn chọn ảnh từ đâu?", [
      { text: "Hủy", style: "cancel" },
      { text: "Thư viện", onPress: pickImage },
      { text: "Chụp ảnh", onPress: takePhoto },
    ]);
  };

  const validateForm = () => {
    const { email, password, confirmPassword, fullName } = formData;

    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin.");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Thông báo", "Email không hợp lệ.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Thông báo", "Mật khẩu xác nhận không khớp.");
      return false;
    }

    if (fullName.trim().length < 2) {
      Alert.alert("Thông báo", "Họ và tên phải có ít nhất 2 ký tự.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        "Đăng ký thành công!",
        `Tài khoản ${formData.email} đã được tạo thành công.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
      setLoading(false);
    }, 1500);
  };

  const selectedRole: Role | undefined = roles.find((role) => role.value === formData.role);

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Quay lại</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>📚</Text>
            </View>
            <Text style={styles.appName}>Đăng ký</Text>
            <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
          </View>

          <Card style={styles.registerCard}>
            <Card.Content style={styles.cardContent}>
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <TouchableOpacity onPress={showImageOptions}>
                  {formData.studentImage ? (
                    <Avatar.Image
                      size={100}
                      source={{ uri: formData.studentImage }}
                      style={styles.avatar}
                    />
                  ) : (
                    <Avatar.Icon
                      size={100}
                      icon="camera-plus"
                      style={styles.avatar}
                      color="#667eea"
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.avatarText}>
                  {formData.studentImage
                    ? "Nhấn để thay đổi ảnh"
                    : "Nhấn để thêm ảnh"}
                </Text>
              </View>

              {/* Role Selection */}
              <View style={styles.roleContainer}>
                <Text style={styles.roleLabel}>Vai trò</Text>
                <Menu
                  visible={roleMenuVisible}
                  onDismiss={() => setRoleMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setRoleMenuVisible(true)}
                      style={styles.roleButton}
                      icon={selectedRole?.icon}
                      contentStyle={styles.roleButtonContent}
                    >
                      {selectedRole?.label}
                    </Button>
                  }
                >
                  {roles.map((role) => (
                    <Menu.Item
                      key={role.value}
                      onPress={() => {
                        handleInputChange("role", role.value);
                        setRoleMenuVisible(false);
                      }}
                      title={role.label}
                      leadingIcon={role.icon}
                    />
                  ))}
                </Menu>
              </View>

              {/* Form Fields */}
              <TextInput
                label="Họ và tên *"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange("fullName", text)}
                style={styles.input}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                theme={{
                  colors: {
                    primary: "#667eea",
                    outline: "#E0E0E0",
                  },
                }}
              />

              <TextInput
                label="Email *"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                left={<TextInput.Icon icon="email" />}
                theme={{
                  colors: {
                    primary: "#667eea",
                    outline: "#E0E0E0",
                  },
                }}
              />

              <TextInput
                label="Mật khẩu *"
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                style={styles.input}
                secureTextEntry={!showPassword}
                mode="outlined"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                theme={{
                  colors: {
                    primary: "#667eea",
                    outline: "#E0E0E0",
                  },
                }}
              />

              <TextInput
                label="Xác nhận mật khẩu *"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  handleInputChange("confirmPassword", text)
                }
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                mode="outlined"
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                theme={{
                  colors: {
                    primary: "#667eea",
                    outline: "#E0E0E0",
                  },
                }}
                error={
                  formData?.confirmPassword &&
                  formData?.password !== formData?.confirmPassword ? true : false
                }
              />

              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <Text style={styles.errorText}>
                    Mật khẩu xác nhận không khớp
                  </Text>
                )}

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.registerButton}
                labelStyle={styles.buttonLabel}
                loading={loading}
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản? </Text>
                <Text style={styles.linkText} onPress={() => router.replace("/start_screen/login")}>
                  Đăng nhập ngay
                </Text>
              </View>
            </Card.Content>
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  registerCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  roleButton: {
    borderColor: "#667eea",
  },
  roleButtonContent: {
    flexDirection: "row-reverse",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  registerButton: {
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 8,
    backgroundColor: "#667eea",
    elevation: 3,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  linkText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  requiredText: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 16,
    fontStyle: "italic",
  },
});

export default RegisterScreen;
