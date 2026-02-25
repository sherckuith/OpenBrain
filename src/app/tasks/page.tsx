"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { Plus, GripVertical, CheckCircle, Clock, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Diseñar arquitectura OpenBrain', description: 'C4 diagrams y ADRs', status: 'done', priority: 'high' },
    { id: '2', title: 'Conectar OpenClaw Logs', description: 'Parser script en Node.js', status: 'todo', priority: 'medium' },
    { id: '3', title: 'Implementar Socket.io', description: 'Real-time updates', status: 'in-progress', priority: 'high' },
  ]);

  const onDragEnd = (result: any) => {
    // Implement DnD later
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
            Tablero de Tareas
          </h1>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            <span>Nueva Tarea</span>
          </button>
        </header>

        <div className="flex gap-6 min-w-full overflow-x-auto pb-4">
          {['Todo', 'In Progress', 'Done'].map((col) => {
            const statusKey = col.toLowerCase().replace(' ', '-') as Task['status'];
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
                        layoutId={task.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm hover:border-gray-600 transition-colors cursor-grab active:cursor-grabbing group relative"
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical size={16} className="text-gray-500" />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                          <span className="text-xs text-gray-500 uppercase">{task.priority}</span>
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

                  <button className="w-full py-2 text-xs text-gray-500 hover:bg-gray-700/50 rounded flex items-center justify-center gap-2 transition-colors">
                    <Plus size={14} />
                    <span>Añadir Tarea</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
