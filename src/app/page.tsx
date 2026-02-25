"use client";

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import {
  FileText, CheckSquare, MessageSquare, Plus, Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Bienvenido, Angel.
            </h1>
            <p className="text-gray-400 text-sm mt-1">Hoy es Lunes 23 de Febrero, 2026.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors">
              <Calendar size={18} />
              <span>Agenda</span>
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
              <Plus size={18} />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckSquare className="text-green-400" size={20} />
                Tareas Pendientes
              </h2>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">3 Open</span>
            </div>
            <ul className="space-y-3">
              {[
                { title: 'Revisar diseño OpenBrain', status: 'In Progress', color: 'bg-yellow-500' },
                { title: 'Sincronizar OpenClaw logs', status: 'Todo', color: 'bg-gray-500' },
                { title: 'Configurar Prisma Schema', status: 'Done', color: 'bg-green-500' },
              ].map((task, i) => (
                <li key={i} className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${task.color}`} />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{task.title}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="text-blue-400" size={20} />
                Chats Recientes
              </h2>
              <Link href="/chats" className="text-xs text-blue-400 hover:underline">Ver todos</Link>
            </div>
            <div className="space-y-4">
              {[
                { user: 'Sophi', msg: 'Revisa el contrato...', time: '10:30 AM' },
                { user: 'Nicolas', msg: 'Papá, ¿me ayudas con la tarea?', time: '09:15 AM' },
                { user: 'Angel (Public)', msg: 'Propuesta enviada...', time: 'Yesterday' },
              ].map((chat, i) => (
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-700/30 rounded-lg cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                    {chat.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium text-gray-200 truncate">{chat.user}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{chat.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors col-span-1 md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="text-purple-400" size={20} />
                Documentos (Graph)
              </h2>
            </div>
            <div className="relative h-48 bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
              <p className="text-xs text-gray-500">Visualización de Nodos</p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
