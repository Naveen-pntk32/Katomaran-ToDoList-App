"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { type Task, useTask } from "@/context/TaskContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { addTask, updateTask } = useTask()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setPriority(task.priority)
      setDueDate(task.dueDate)
    } else {
      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueDate(undefined)
    }
  }, [task, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setIsSubmitting(true)

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate,
        status: task?.status || ("open" as const),
      }

      if (isEditing && task) {
        await updateTask(task.id, taskData)
      } else {
        await addTask(taskData)
      }

      onClose()
    } catch (error) {
      console.error("Error saving task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearDueDate = () => {
    setDueDate(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP p") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  {dueDate && (
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        value={dueDate ? format(dueDate, "HH:mm") : ""}
                        onChange={(e) => {
                          if (dueDate && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":")
                            const newDate = new Date(dueDate)
                            newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                            setDueDate(newDate)
                          }
                        }}
                      />
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              {dueDate && (
                <Button type="button" variant="outline" size="icon" onClick={clearDueDate}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
