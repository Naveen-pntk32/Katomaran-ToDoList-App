"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialIcons"

import { AuthProvider } from "./src/context/AuthContext"
import { TaskProvider } from "./src/context/TaskContext"
import { theme } from "./src/utils/theme"
import AuthScreen from "./src/screens/AuthScreen"
import TaskListScreen from "./src/screens/TaskListScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import AddEditTaskScreen from "./src/screens/AddEditTaskScreen"
import TaskDetailScreen from "./src/screens/TaskDetailScreen"
import { useAuth } from "./src/context/AuthContext"
import LoadingScreen from "./src/components/LoadingScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = ""
        if (route.name === "Tasks") iconName = "list"
        else if (route.name === "Profile") iconName = "person"

        return <Icon name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Tasks" component={TaskListScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
)

const AppNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} options={{ presentation: "modal" }} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <TaskProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
            </NavigationContainer>
          </TaskProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
