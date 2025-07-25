"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { View, StyleSheet, FlatList, RefreshControl } from "react-native"
import { FAB, Searchbar, Chip, Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

import { useTask } from "../context/TaskContext"
import type { RootStackParamList, Task } from "../types"
import TaskItem from "../components/TaskItem"
import EmptyState from "../components/EmptyState"
import { theme } from "../utils/theme"

type NavigationProp = StackNavigationProp<RootStackParamList>

const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { tasks, loading, refreshTasks } = useTask()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "complete">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all")

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || task.status === statusFilter
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        // Sort by priority first, then by due date
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }

        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime()
        }

        return b.createdAt.getTime() - a.createdAt.getTime()
      })
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const handleAddTask = () => {
    navigation.navigate("AddEditTask", {})
  }

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem task={item} onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })} />
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          My Tasks
        </Text>

        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.filters}>
          <View style={styles.filterRow}>
            <Text variant="labelMedium" style={styles.filterLabel}>
              Status:
            </Text>
            <Chip selected={statusFilter === "all"} onPress={() => setStatusFilter("all")} style={styles.chip}>
              All
            </Chip>
            <Chip selected={statusFilter === "open"} onPress={() => setStatusFilter("open")} style={styles.chip}>
              Open
            </Chip>
            <Chip
              selected={statusFilter === "complete"}
              onPress={() => setStatusFilter("complete")}
              style={styles.chip}
            >
              Complete
            </Chip>
          </View>

          <View style={styles.filterRow}>
            <Text variant="labelMedium" style={styles.filterLabel}>
              Priority:
            </Text>
            <Chip selected={priorityFilter === "all"} onPress={() => setPriorityFilter("all")} style={styles.chip}>
              All
            </Chip>
            <Chip selected={priorityFilter === "high"} onPress={() => setPriorityFilter("high")} style={styles.chip}>
              High
            </Chip>
            <Chip
              selected={priorityFilter === "medium"}
              onPress={() => setPriorityFilter("medium")}
              style={styles.chip}
            >
              Medium
            </Chip>
            <Chip selected={priorityFilter === "low"} onPress={() => setPriorityFilter("low")} style={styles.chip}>
              Low
            </Chip>
          </View>
        </View>
      </View>

      {filteredTasks.length === 0 ? (
        <EmptyState
          title={searchQuery || statusFilter !== "all" || priorityFilter !== "all" ? "No tasks found" : "No tasks yet"}
          subtitle={
            searchQuery || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Tap the + button to create your first task"
          }
        />
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshTasks} />}
        />
      )}

      <FAB icon="plus" style={styles.fab} onPress={handleAddTask} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  searchbar: {
    marginBottom: 16,
  },
  filters: {
    gap: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  filterLabel: {
    minWidth: 60,
    fontWeight: "600",
  },
  chip: {
    marginRight: 4,
  },
  list: {
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default TaskListScreen
