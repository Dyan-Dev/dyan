// File: apps/frontend/components/SavedEndpointsSidebar.tsx

import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil, Copy, Trash2, Settings, Zap } from 'lucide-react'
import { useState } from 'react'

export interface Endpoint {
  path: string
  method: string
  language: 'javascript' | 'python'
}

interface SidebarProps {
  endpoints: Endpoint[]
  onEdit: (index: number) => void
  onDuplicate: (index: number) => void
  onDelete: (index: number) => void
  onTest: (endpoint: Endpoint) => void
}

export default function SavedEndpointsSidebar({ endpoints, onEdit, onDuplicate, onDelete, onTest }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4 hidden md:block">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Endpoints</h2>
        <Settings
          className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-black"
          onClick={() => setShowSettings(!showSettings)}
        />
      </div>

      <div className="space-y-2">
        {endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
              {ep.method} {ep.path}
            </span>
            <div className="flex gap-1">
              <span title="Test">
                <Zap
                  className="w-4 h-4 text-green-500 cursor-pointer hover:text-green-700"
                  onClick={() => onTest(ep)}
                />
              </span>
              <span title="Edit">
                <Pencil
                  className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => onEdit(idx)}
                />
              </span>
              <span title="Duplicate">
                <Copy
                  className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => onDuplicate(idx)}
                />
              </span>
              <span title="Delete">
                <Trash2
                  className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => onDelete(idx)}
                />
              </span>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full justify-start text-gray-700 dark:text-white">
          <PlusCircle className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>
    </div>
  )
}
