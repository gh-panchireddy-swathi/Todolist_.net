import axios from "axios";

// ✅ Define the Task interface for type safety
export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high'; // changed 'urgent' to 'high' for consistency
}

// ✅ Base URL to your .NET Core backend
const API_BASE = "http://localhost:5109/api";

// Helper to get auth headers
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// ✅ Get all tasks (Read)
export const getTasks = async (): Promise<Task[]> => {
  try {
    const res = await axios.get(`${API_BASE}/tasks`, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// ✅ Create a new task (Create)
export const createTask = async (task: Task): Promise<Task> => {
  try {
    const res = await axios.post(`${API_BASE}/tasks`, task, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// ✅ Update a task (PUT full object or partial)
export async function updateTask(id: number, taskData: Partial<Task>) {
  const res = await fetch(`${API_BASE}/TodoTask/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error('Failed to update task');
}

// ✅ Toggle task completion helper
export async function toggleTaskComplete(task: Task) {
  await updateTask(task.id!, { ...task, isCompleted: !task.isCompleted });
}

// ✅ Delete a task (Delete)
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/tasks/${id}`, { headers: getAuthHeaders() });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
