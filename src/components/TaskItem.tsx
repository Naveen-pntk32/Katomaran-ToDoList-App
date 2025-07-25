import type React from "react"
import { View, StyleSheet, Alert } from "react-native"
import { Card, Text, Chip, IconButton, Checkbox } from "react-native-paper"
import { Swipeable } from "react-native-gesture-handler"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated"

import type { Task } from "../types"
import { useTask } from "../context/TaskContext"
import { theme } from "../utils/theme"
import { formatDate } from "../utils/dateUtils"

interface TaskItemProps {
  task: Task
  onPress: () => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const { updateTask, deleteTask } = useTask()
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  const handleToggleComplete = async () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1)
    })

    await updateTask(task.id, {
      status: task.status === "complete" ? "open" : "complete",
    })
  }

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          opacity.value = withTiming(0, { duration: 300 })
          await deleteTask(task.id)
        },
      },
    ])
  }

  const renderRightActions = () => (
    <View style={styles.rightActions}>
      <IconButton
        icon="delete"
        iconColor="white"
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDelete}
      />
    </View>
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#f44336"
      case "medium":
        return "#ff9800"
      case "low":
        return "#4caf50"
      default:
        return theme.colors.primary
    }
  }

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status === "open"

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Animated.View style={animatedStyle}>
        <Card
          style={[styles.card, task.status === "complete" && styles.completedCard, isOverdue && styles.overdueCard]}
          onPress={onPress}
        >
          <Card.Content style={styles.content}>
            <View style={styles.header}>
              <Checkbox status={task.status === "complete" ? "checked" : "unchecked"} onPress={handleToggleComplete} />
              <View style={styles.taskInfo}>
                <Text
                  variant="titleMedium"
                  style={[styles.title, task.status === "complete" && styles.completedText]}
                  numberOfLines={2}
                >
                  {task.title}
                </Text>
                {task.description && (
                  <Text
                    variant="bodyMedium"
                    style={[styles.description, task.status === "complete" && styles.completedText]}
                    numberOfLines={2}
                  >
                    {task.description}
                  </Text>
                )}
              </View>
              <Chip
                style={[styles.priorityChip, { backgroundColor: getPriorityColor(task.priority) }]}
                textStyle={styles.priorityText}
              >
                {task.priority.toUpperCase()}
              </Chip>
            </View>

            {task.dueDate && (
              <View style={styles.footer}>
                <Text variant="bodySmall" style={[styles.dueDate, isOverdue && styles.overdueText]}>
                  Due: {formatDate(task.dueDate)}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </Animated.View>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  priorityChip: {
    height: 24,
  },
  priorityText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 8,
    paddingLeft: 48,
  },
  dueDate: {
    color: theme.colors.onSurfaceVariant,
  },
  overdueText: {
    color: "#f44336",
    fontWeight: "600",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 16,
  },
  actionButton: {
    margin: 0,
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
})

export default TaskItem
