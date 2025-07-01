// File: app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Star, Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { toggleTaskComplete } from "../lib/api";

// Types
interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  isCompleted: boolean;
  priority: Priority;
}

type Priority = 'low' | 'medium' | 'high';
type TaskStatus = 'completed' | 'incomplete';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  priority: Priority;
}

const TodoPage: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  const [showFullForm, setShowFullForm] = useState(false);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    isCompleted: false,
    priority: 'medium'
  });

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Form management
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        dueDate: editingTask.dueDate.toISOString().split('T')[0],
        isCompleted: editingTask.isCompleted,
        priority: editingTask.priority
      });
      setShowFullForm(true);
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        isCompleted: false,
        priority: 'medium'
      });
    }
  }, [editingTask]);

  // Data fetching
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5109/api/Tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          // Convert dueDate string to Date object
          setTasks((data as Task[]).map((t) => ({ ...t, dueDate: new Date(t.dueDate) })));
        }
      } catch {
        // handle error if needed
      }
    };
    fetchTasks();
  }, []);

  // Task operations
  const addTask = async (taskData: Omit<Task, 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch('http://localhost:5109/api/Tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks(prev => [...prev, { ...newTask, dueDate: new Date(newTask.dueDate) }]);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`http://localhost:5109/api/Tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTask),
    });
    if (res.ok) {
      setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTask(null);
    }
  };

  const deleteTask = async (taskId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`http://localhost:5109/api/Tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  // Toggle task completion
  const handleToggleTaskComplete = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      await toggleTaskComplete({
        ...task,
        dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
      });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    } catch {
      // Optionally handle error
    }
  };

  // Form handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: new Date(formData.dueDate), // This will include time
      isCompleted: formData.isCompleted,
      priority: formData.priority
    };

    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      addTask(taskData);
    }

    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        isCompleted: false,
        priority: 'medium'
      });
      setShowFullForm(false);
    }
  };

  const handleCancel = () => {
    setShowFullForm(false);
    setFormData({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      isCompleted: false,
      priority: 'medium'
    });
    setEditingTask(null);
  };

  // Utility functions
  const formatDueDate = (date: Date) => {
    // Format: dd/MM/yyyy HH:mm
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const getDueDateColor = (date: Date, isCompleted: boolean) => {
    if (isCompleted) return 'text-green-400';
    if (isPast(date) && !isToday(date)) return 'text-red-400';
    if (isToday(date)) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    const baseClass = "w-4 h-4";
    switch (priority) {
      case 'high':
        return <Star className={`${baseClass} fill-red-500 text-red-500`} />;
      case 'medium':
        return <Star className={`${baseClass} fill-yellow-500 text-yellow-500`} />;
      case 'low':
        return <Star className={`${baseClass} fill-green-500 text-green-500`} />;
    }
  };

  // Filtering and sorting
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && task.isCompleted) ||
      (filter === 'incomplete' && !task.isCompleted);
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-900 border-blue-500 border-2 p-3 sm:p-6 lg:p-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-0">To Do List</h1>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          </div>

          <div className="text-center mb-4 sm:mb-8">
            
            {/* Task Form */}
            {!showFullForm && !editingTask ? (
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <Input
                  placeholder="Add a new task..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && formData.title.trim()) {
                      setShowFullForm(true);
                    }
                  }}
                  className="bg-white text-black max-w-md"
                />
                <Button 
                  onClick={() => setShowFullForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                  disabled={!formData.title.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-600 p-6 mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    {editingTask ? <Edit className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                    <h3 className="text-xl font-semibold text-white">
                      {editingTask ? 'Edit Task' : <span className="text-white">+ Add New Task</span>}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Task Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter task title"
                        className="bg-white text-black"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4 text-white" />
                        Due Date *
                      </Label>
                      <Input
                        id="dueDate"
                        type="datetime-local"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="bg-white text-black"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add task description..."
                      className="bg-white text-black min-h-[80px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-white">
                        {getPriorityIcon(formData.priority)}
                        Priority
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger className="bg-white text-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-green-500 text-green-500" />
                              <span className="text-black">Low Priority</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-black">Medium Priority</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-red-500 text-red-500" />
                              <span className="text-black">High Priority</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="isCompleted" className="text-white">Mark as Completed</Label>
                      <div className="flex items-center gap-2 border rounded bg-white px-3 py-1.5" style={{height: '38px'}}>
                        <Checkbox
                          id="isCompleted"
                          checked={formData.isCompleted}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, isCompleted: checked as boolean })
                          }
                          className="mr-2"
                        />
                        <span className="text-black text-base">Completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1">
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* Task Filter */}
          <div className="mb-4 sm:mb-6">
            <Card className="bg-gray-800 border-gray-600 p-3 sm:p-4">
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-black text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2 sm:mb-0">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 hidden sm:inline">Filter:</span>
                  </div>
                  <div className="flex gap-1 flex-1">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                      className={`flex-1 text-xs sm:text-sm ${filter === 'all' ? 'bg-blue-600' : ''}`}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === 'incomplete' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('incomplete')}
                      className={`flex-1 text-xs sm:text-sm ${filter === 'incomplete' ? 'bg-blue-600' : ''}`}
                    >
                      Active
                    </Button>
                    <Button
                      variant={filter === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('completed')}
                      className={`flex-1 text-xs sm:text-sm ${filter === 'completed' ? 'bg-blue-600' : ''}`}
                    >
                      Done
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <Select value={sortBy} onValueChange={v => setSortBy(v as 'dueDate' | 'priority' | 'title')}>
                    <SelectTrigger className="bg-white text-black text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                      <SelectItem value="priority">Sort by Priority</SelectItem>
                      <SelectItem value="title">Sort by Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Task List */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-2 sm:mb-4">Task List</h2>
            
            {sortedTasks.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-base sm:text-lg mb-2">No tasks found</div>
                <div className="text-gray-500 text-sm">
                  Add a new task to get started!
                </div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {sortedTasks.map((task) => (
                  <Card key={task.id} className={`p-4 transition-all duration-200 hover:shadow-lg ${
                    task.isCompleted 
                      ? 'bg-gray-700/50 border-green-500/30' 
                      : 'bg-gray-800 border-gray-600 hover:border-blue-500/50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Checkbox
                          checked={task.isCompleted}
                          onCheckedChange={() => handleToggleTaskComplete(task.id)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-medium text-white ${
                            task.isCompleted ? 'line-through text-gray-400' : ''
                          }`}>
                            {task.title}
                          </h3>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {getPriorityIcon(task.priority)}
                            <Badge 
                              variant="secondary" 
                              className={`${getPriorityColor(task.priority)} text-white text-xs`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>

                        {task.description && (
                          <p className={`text-sm mb-2 ${
                            task.isCompleted ? 'text-gray-500' : 'text-gray-300'
                          }`}>
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${getDueDateColor(task.dueDate, task.isCompleted)}`}>
                            Due: {formatDueDate(task.dueDate)}
                          </span>
                          {isPast(task.dueDate) && !task.isCompleted && !isToday(task.dueDate) && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTask(task)}
                            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Task Statistics */}
          <div className="text-center pt-2 sm:pt-4 border-t border-blue-500">
            <p className="text-sm sm:text-lg">
              Completed: <span className="text-green-400 font-bold">{completedCount}</span> | Uncompleted: <span className="text-red-400 font-bold">{totalCount - completedCount}</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TodoPage;
