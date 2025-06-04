import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text, Card, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      if (email === "teacher@gmail.com" && password === "teacher") {
        router.replace("/(tabs)");
      }
      else if (email === "student@gmail.com" && password === "student") {
        router.replace("/student")
      } else {
        Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không đúng.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>📚</Text>
            </View>
            <Text style={styles.appName}>Attendance App</Text>
            <Text style={styles.subtitle}>Hệ thống điểm danh</Text>
          </View>

          <Card style={styles.loginCard}>r
            <Card.Content style={styles.cardContent}>
              <Text style={styles.title}>Đăng nhập</Text>
              <Text style={styles.welcomeText}>Chào mừng bạn trở lại!</Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
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
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
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

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                labelStyle={styles.buttonLabel}
                loading={loading}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              {/* <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>hoặc</Text>
                <View style={styles.dividerLine} />
              </View> */}

              {/* <View style={styles.socialButtons}>
                <IconButton
                  icon="google"
                  mode="outlined"
                  size={24}
                  onPress={() =>
                    Alert.alert("Thông báo", "Tính năng đang phát triển")
                  }
                  style={styles.socialButton}
                />
                <IconButton
                  icon="facebook"
                  mode="outlined"
                  size={24}
                  onPress={() =>
                    Alert.alert("Thông báo", "Tính năng đang phát triển")
                  }
                  style={styles.socialButton}
                />
                <IconButton
                  icon="apple"
                  mode="outlined"
                  size={24}
                  onPress={() =>
                    Alert.alert("Thông báo", "Tính năng đang phát triển")
                  }
                  style={styles.socialButton}
                />
              </View> */}

              <View style={styles.footer}>
                <Text style={styles.footerText}>Chưa có tài khoản? </Text>
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    // Alert.alert("Thông báo", "Tính năng đang phát triển")
                    router.push("/start_screen/register")
                  }
                >
                  Đăng ký ngay
                </Text>
              </View>

              {/* <Text
                style={styles.forgotPassword}
                onPress={() =>
                  Alert.alert("Thông báo", "Tính năng đang phát triển")
                }
              >
                Quên mật khẩu?
              </Text> */}
            </Card.Content>
          </Card>

          {/* <Text style={styles.demoInfo}>Demo: teacher@gmail.com / teacher</Text> */}
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
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backdropFilter: "blur(10px)",
  },
  logoText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  loginCard: {
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  loginButton: {
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
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
  forgotPassword: {
    textAlign: "center",
    color: "#667eea",
    fontSize: 14,
    fontWeight: "500",
  },
  demoInfo: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 20,
    fontStyle: "italic",
  },
});

export default LoginScreen;
