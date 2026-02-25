"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR, { mutate } from 'swr';
import Sidebar from '@/components/Sidebar';
import { Plus, GripVertical, CheckCircle, Clock, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export default function TasksPage() {
  const { data: serverTasks, error } = useSWR<Task[]>('/api/tasks', fetcher);
  const tasks = serverTasks || [];

  const handleCreateTask = async (status: string) => {
    const title = prompt("Nueva tarea:");
    if (!title) return;

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status, priority: 'medium' })
    });
    mutate('/api/tasks'); // Refresh data
  };

  const handleMoveTask = async (task: Task, newStatus: string) => {
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, status: newStatus })
    });
    mutate('/api/tasks');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
            Tablero de Tareas
          </h1>
          <button
            onClick={() => handleCreateTask('todo')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            <span>Nueva Tarea</span>
          </button>
        </header>

        {(error) ? <div className="text-red-500">Error cargando tareas</div> :
          (!serverTasks) ? <div className="text-gray-500">Cargando...</div> : (
            <div className="flex gap-6 min-w-full overflow-x-auto pb-4">
              {['Todo', 'In Progress', 'Done'].map((col) => {
                const statusKey = col.toLowerCase().replace(' ', '-') as any;
                const colTasks = tasks.filter(t => t.status === statusKey);

                return (
                  <div key={col} className="w-80 flex-shrink-0 bg-gray-800/30 rounded-xl p-4 border border-gray-800">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">{col}</h3>
                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">{colTasks.length}</span>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {colTasks.map((task) => (
                          <motion.div
                            key={task.id}
                            layoutId={String(task.id)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm hover:border-gray-600 transition-colors group relative"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`} />
                                <span className="text-xs text-gray-500 uppercase">{task.priority}</span>
                              </div>
                              {/* Simple Move Actions */}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {task.status !== 'todo' && (
                                  <button onClick={() => handleMoveTask(task, 'todo')} className="p-1 hover:bg-gray-700 rounded text-gray-400" title="Move to Todo">
                                    <ArrowLeft size={14} />
                                  </button>
                                )}
                                {task.status !== 'in-progress' && (
                                  <button onClick={() => handleMoveTask(task, 'in-progress')} className="p-1 hover:bg-gray-700 rounded text-gray-400" title="Move to In Progress">
                                    <Clock size={14} />
                                  </button>
                                )}
                                {task.status !== 'done' && (
                                  <button onClick={() => handleMoveTask(task, 'done')} className="p-1 hover:bg-gray-700 rounded text-gray-400" title="Move to Done">
                                    <CheckCircle size={14} />
                                  </button>
                                )}
                              </div>
                            </div>

                            <h4 className="text-sm font-medium text-gray-200 mb-1">{task.title}</h4>
                            <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>


                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-700/50">
                              {task.status === 'done' ? (
                                <div className="flex items-center gap-1 text-green-500 text-xs">
                                  <CheckCircle size={14} />
                                  <span>Completado</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-gray-500 text-xs">
                                  <Clock size={14} />
                                  <span>Due soon</span>
                                </div>
                              )}
                              <div className="flex -space-x-2 ml-auto">
                                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-gray-800 flex items-center justify-center text-[10px] font-bold">A</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button
                        onClick={() => handleCreateTask(statusKey)}
                        className="w-full py-2 text-xs text-gray-500 hover:bg-gray-700/50 rounded flex items-center justify-center gap-2 transition-colors"
                      >
                        <Plus size={14} />
                        <span>Añadir Tarea</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}
