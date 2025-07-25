"use client"

import type React from "react"
import { useState } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { TextInput, Button, SegmentedButtons, Text, Card, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import DateTimePickerModal from "react-native-modal-datetime-picker"

import { useTask } from "../context/TaskContext"
import type { RootStackParamList } from "../types"
import { theme } from "../utils/theme"
import { formatDate } from "../utils/dateUtils"

type RouteProps = RouteProp<RootStackParamList, "AddEditTask">

const AddEditTaskScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RouteProps>()
  const { addTask, updateTask } = useTask()

  const isEditing = !!route.params?.task
  const existingTask = route.params?.task

  const [title, setTitle] = useState(existingTask?.title || "")
  const [description, setDescription] = useState(existingTask?.description || "")
  const [priority, setPriority] = useState(existingTask?.priority || "medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(existingTask?.dueDate)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Please enter a task title.")
      return
    }

    try {
      setLoading(true)

      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority as "low" | "medium" | "high",
        dueDate,
        status: existingTask?.status || ("open" as const),
      }

      if (isEditing && existingTask) {
        await updateTask(existingTask.id, taskData)
      } else {
        await addTask(taskData)
      }

      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", "Failed to save task. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDateConfirm = (date: Date) => {
    setDueDate(date)
    setShowDatePicker(false)
  }

  const clearDueDate = () => {
    setDueDate(undefined)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="close" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          {isEditing ? "Edit Task" : "New Task"}
        </Text>
        <Button mode="contained" onPress={handleSave} loading={loading} disabled={loading || !title.trim()} compact>
          Save
        </Button>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Task Title *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              maxLength={100}
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              maxLength={500}
            />

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Priority
              </Text>
              <SegmentedButtons
                value={priority}
                onValueChange={setPriority}
                buttons={priorityOptions}
                style={styles.segmentedButtons}
              />
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Due Date
              </Text>
              <View style={styles.dateSection}>
                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  icon="calendar"
                  style={styles.dateButton}
                >
                  {dueDate ? formatDate(dueDate) : "Set Due Date"}
                </Button>
                {dueDate && <IconButton icon="close" onPress={clearDueDate} style={styles.clearDateButton} />}
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        minimumDate={new Date()}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateButton: {
    flex: 1,
  },
  clearDateButton: {
    margin: 0,
  },
})

export default AddEditTaskScreen
