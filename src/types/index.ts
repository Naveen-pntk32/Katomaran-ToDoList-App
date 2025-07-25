export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  status: "open" | "complete"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  refreshTasks: () => Promise<void>
}

export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  AddEditTask: { task?: Task }
  TaskDetail: { taskId: string }
}
