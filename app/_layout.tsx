import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PaperProvider } from 'react-native-paper';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập (giả lập)
    const checkLogin = async () => {
      // Thay thế bằng logic kiểm tra thực tế (ví dụ: AsyncStorage)
      const loggedIn = false; // Giả lập
      setIsLoggedIn(loggedIn);
    };
    checkLogin();
  }, []);

  if (!loaded || isLoggedIn === null) {
    return null;
  }
  console.log("🚀 ~ RootLayout ~ isLoggedIn:", isLoggedIn)

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {isLoggedIn ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="start_screen" options={{ headerShown: false }} />
          )}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
