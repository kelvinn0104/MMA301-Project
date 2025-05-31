import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, StatusBar, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Button, Title, Paragraph, Card, Surface, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Define the type for attendance record
interface AttendanceRecord {
  studentId: string;
  classId: string;
  timestamp: string;
}

// Define the type for QR data
interface QRData {
  classId: string;
  ipAddress: string;
  expiryTime: string; // Định dạng: "YYYY-MM-DD HH:mm"
}

const StudentAttendance = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'failure' | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const studentId = 'SV001'; // Mô phỏng ID sinh viên
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [scanAnimation] = useState(new Animated.Value(0));

  // Animate scan frame
  useEffect(() => {
    if (!scanned) {
      const animateScan = () => {
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => animateScan());
      };
      animateScan();
    }
  }, [scanned]);

  // Request camera permission
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

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

  // Hàm lấy thời gian Việt Nam
  const getVietnamTime = (addMinutes = 0) => {
    const now = new Date();
    if (addMinutes > 0) {
      now.setMinutes(now.getMinutes() + addMinutes);
    }
    
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);
  };

  // Handle QR code scan
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      // Giả sử mã QR chứa JSON với classId, ipAddress và expiryTime
      const qrData: QRData = JSON.parse(data);
      const { classId, ipAddress, expiryTime } = qrData;
      const timestamp = new Date().toISOString();

      // Lấy thời gian hiện tại theo múi giờ Việt Nam
      const currentVietnamTime = getVietnamTime();
      
      // Kiểm tra thời gian hết hạn
      if (currentVietnamTime > expiryTime) {
        setScanResult('failure');
        Alert.alert(
          '❌ Điểm danh thất bại',
          `Mã QR đã hết hạn vào lúc ${expiryTime}.\nVui lòng lấy mã QR mới từ giảng viên.`,
          [
            { 
              text: 'Quét lại', 
              onPress: () => scanAgain(),
              style: 'default' 
            },
            { 
              text: 'Đóng', 
              style: 'default' 
            }
          ]
        );
        return;
      }

      if (!currentIp) {
        setScanResult('failure');
        Alert.alert(
          '❌ Điểm danh thất bại', 
          'Không thể lấy địa chỉ IP hiện tại.\nVui lòng kiểm tra kết nối mạng và thử lại.',
          [
            { 
              text: 'Quét lại', 
              onPress: () => scanAgain(),
              style: 'default' 
            },
            { 
              text: 'Đóng', 
              style: 'default' 
            }
          ]
        );
        return;
      }

      // Kiểm tra IP
      if (currentIp === ipAddress) {
        setScanResult('success');
        const newRecord: AttendanceRecord = {
          studentId,
          classId,
          timestamp,
        };
        setAttendanceRecords((prev) => [...prev, newRecord]);
        Alert.alert(
          '✅ Điểm danh thành công',
          `Sinh viên ${studentId} đã điểm danh thành công!\n\n` +
          `📚 Lớp: ${classId}\n` +
          `🕐 Thời gian: ${new Date(timestamp).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}\n` +
        //   `📍 IP: ${currentIp}`,
          [{ text: 'Tuyệt vời!', style: 'default' }]
        );
      } else {
        setScanResult('failure');
        Alert.alert(
          '❌ Điểm danh thất bại',
          `Bạn không ở trong lớp học!\n\n` +
          `🏫 IP lớp học: ${ipAddress}\n` +
          `📱 IP của bạn: ${currentIp}\n\n` +
          `Vui lòng kết nối WiFi của lớp học để điểm danh.`,
          [
            { 
              text: 'Quét lại', 
              onPress: () => scanAgain(),
              style: 'default' 
            }
          ]
        );
      }
    } catch (error) {
      setScanResult('failure');
      Alert.alert(
        '❌ Điểm danh thất bại', 
        'Mã QR không hợp lệ hoặc bị lỗi.\nVui lòng yêu cầu giảng viên tạo mã QR mới.',
        [
          { 
            text: 'Quét lại', 
            onPress: () => scanAgain(),
            style: 'default' 
          }
        ]
      );
    }
  };

  // Reset scan state to scan again
  const scanAgain = () => {
    setScanned(false);
    setScanResult(null);
  };

  // Handle permission status
  if (hasPermission === null) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Surface style={styles.loadingCard}>
            <Text style={styles.loadingText}>Đang yêu cầu quyền truy cập camera...</Text>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </Surface>
        </View>
      </LinearGradient>
    );
  }

  if (hasPermission === false) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Surface style={styles.errorCard}>
            <IconButton icon="camera-off" size={60} iconColor="#ff6b6b" />
            <Title style={styles.errorTitle}>Không có quyền camera</Title>
            <Paragraph style={styles.errorText}>
              Vui lòng cấp quyền truy cập camera trong cài đặt để sử dụng tính năng điểm danh QR.
            </Paragraph>
            <Button 
              mode="contained" 
              onPress={() => router.back()}
              style={styles.backButton}
              buttonColor="#667eea"
            >
              Quay lại
            </Button>
          </Surface>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {scanResult === 'success' ? (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.resultBackground}>
          <View style={styles.resultContainer}>
            <Card style={styles.resultCard}>
              <Card.Content style={styles.resultContent}>
                <IconButton icon="check-circle" size={80} iconColor="#4caf50" />
                <Title style={styles.resultTitle}>Điểm danh hoàn tất! 🎉</Title>
                <Paragraph style={styles.resultText}>
                  Quét mã QR thành công. Kết quả đã được ghi nhận.
                </Paragraph>
                
                <Surface style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Sinh viên:</Text>
                    <Text style={styles.infoValue}>{studentId}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Thời gian:</Text>
                    <Text style={styles.infoValue}>
                      {new Date().toLocaleString('vi-VN')}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>IP hiện tại:</Text>
                    <Text style={styles.infoValue}>{currentIp || 'Đang tải...'}</Text>
                  </View>
                </Surface>

                <Button 
                  mode="contained" 
                  onPress={scanAgain} 
                  style={styles.scanAgainButton}
                  buttonColor="#667eea"
                  icon="qrcode-scan"
                >
                  Quét lại
                </Button>
              </Card.Content>
            </Card>
          </View>
        </LinearGradient>
      ) : scanResult === 'failure' ? (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.resultBackground}>
          <View style={styles.resultContainer}>
            <Card style={styles.failureCard}>
              <Card.Content style={styles.resultContent}>
                <IconButton icon="close-circle" size={80} iconColor="#ff6b6b" />
                <Title style={styles.failureTitle}>Điểm danh thất bại! ❌</Title>
                <Paragraph style={styles.resultText}>
                  Quét mã QR không thành công. Vui lòng thử lại.
                </Paragraph>
                
                <Surface style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Sinh viên:</Text>
                    <Text style={styles.infoValue}>{studentId}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Thời gian:</Text>
                    <Text style={styles.infoValue}>
                      {getVietnamTime()}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>IP hiện tại:</Text>
                    <Text style={styles.infoValue}>{currentIp || 'Đang tải...'}</Text>
                  </View>
                </Surface>

                <Button 
                  mode="contained" 
                  onPress={scanAgain} 
                  style={styles.scanAgainButton}
                  buttonColor="#ff6b6b"
                  icon="qrcode-scan"
                >
                  Quét lại
                </Button>
              </Card.Content>
            </Card>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.scannerContainer}>
          {/* Back button overlay */}
          {/* <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonContainer}>
              <IconButton icon="arrow-left" size={24} iconColor="#ffffff" />
            </View>
          </TouchableOpacity> */}
          
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <View style={styles.topOverlay}>
              <Text style={styles.instructionText}>Hướng camera về phía mã QR</Text>
              <Text style={styles.subInstructionText}>Đảm bảo mã QR nằm trong khung quét</Text>
            </View>
            
            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                {/* Corner borders */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Animated scan line */}
                <Animated.View
                  style={[
                    styles.scanLine,
                    {
                      transform: [
                        {
                          translateY: scanAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 220],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
            </View>
            
            <View style={styles.bottomOverlay}>
              {/* <Surface style={styles.statusCard}>
                <View style={styles.statusRow}>
                  <IconButton icon="ip-network" size={20} iconColor="#667eea" />
                  <Text style={styles.statusText}>IP: {currentIp || 'Đang tải...'}</Text>
                </View>
                <View style={styles.statusRow}>
                  <IconButton icon="account" size={20} iconColor="#667eea" />
                  <Text style={styles.statusText}>ID: {studentId}</Text>
                </View>
              </Surface> */}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    paddingTop: StatusBar.currentHeight || 0,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
    marginHorizontal: 4,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },
  
  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 8,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
// Scanner styles
scannerContainer: { 
    flex: 1 
},
backButton: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: (StatusBar.currentHeight || 0) + 20,
    left: 20,
    zIndex: 1000,
  },
  backButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subInstructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  scanArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00E676',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  bottomOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  statusCard: {
    borderRadius: 15,
    padding: 16,
    elevation: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statusText: {
    color: '#333',
    fontSize: 14,
    marginLeft: 8,
  },
  
  // Result styles
  resultBackground: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultCard: {
    borderRadius: 20,
    elevation: 8,
    minWidth: width * 0.9,
  },
  resultContent: {
    alignItems: 'center',
    padding: 30,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  scanAgainButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  failureCard: {
    borderRadius: 20,
    elevation: 8,
    minWidth: width * 0.9,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  failureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default StudentAttendance;