// app/index.tsx
import { Redirect } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function Index() {
  return (
    <PaperProvider>
      <Redirect href="/(tabs)/home" />
    </PaperProvider>
  );
}
