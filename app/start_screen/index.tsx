import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import {
  Text,
  Button,
  Surface,
  Icon,
  Divider,
  useTheme,
} from "react-native-paper";

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  iconColor: string;
  backgroundColor: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  iconColor,
  backgroundColor,
}) => {
  return (
    <View style={styles.featureContainer}>
      <Surface
        style={[styles.iconContainer, { backgroundColor }]}
        elevation={2}
      >
        <Icon source={icon} size={28} color={iconColor} />
      </Surface>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen: React.FC = () => {
  const theme = useTheme();

  const handleContinue = () => {
    // Navigate to main app or login screen
    console.log("Continue pressed");
  };

  const handleTermsPress = () => {
    // Open terms of service
    console.log("Terms of Service pressed");
  };

  const handlePrivacyPress = () => {
    // Open privacy policy
    console.log("Privacy Policy pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Welcome to your</Text>
            <Text style={styles.appNameText}>Student Attendance</Text>
            <Text style={styles.appText}>Application</Text>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="account-group"
            title="Class Management"
            description="Easily manage multiple classes and organize student information efficiently"
            iconColor="#1976D2"
            backgroundColor="#E3F2FD"
          />

          <FeatureItem
            icon="check-circle"
            title="Quick Attendance"
            description="Take attendance quickly with intuitive interface and real-time updates"
            iconColor="#4CAF50"
            backgroundColor="#E8F5E8"
          />

          <FeatureItem
            icon="chart-line"
            title="Progress Tracking"
            description="Monitor attendance patterns and generate detailed reports for better insights"
            iconColor="#FF9800"
            backgroundColor="#FFF8E1"
          />

          <FeatureItem
            icon="sync"
            title="Real-time Sync"
            description="Sync attendance data across devices and keep everything up to date"
            iconColor="#9C27B0"
            backgroundColor="#F3E5F5"
          />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          {/* User Icon */}
          <Surface style={styles.userIconContainer} elevation={3}>
            <Icon source="account-multiple" size={32} color="#1976D2" />
          </Surface>

          {/* Terms Text */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By pressing continue, you agree to our{" "}
              <Text style={styles.linkText} onPress={handleTermsPress}>
                Terms of Service
              </Text>{" "}
              and that you have read our{" "}
              <Text style={styles.linkText} onPress={handlePrivacyPress}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Continue Button */}
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.continueButton}
            labelStyle={styles.continueButtonText}
            contentStyle={styles.continueButtonContent}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: "flex-start",
  },
  welcomeTextContainer: {
    alignItems: "flex-start",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 40,
  },
  appNameText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1976D2",
    lineHeight: 40,
  },
  appText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1976D2",
    lineHeight: 40,
  },
  featuresContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  featureContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
    paddingTop: 4,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
    lineHeight: 24,
  },
  featureDescription: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
  },
  bottomContainer: {
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: "center",
  },
  userIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  termsContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  linkText: {
    color: "#1976D2",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  continueButton: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#1976D2",
    elevation: 2,
  },
  continueButtonContent: {
    paddingVertical: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default OnboardingScreen;
