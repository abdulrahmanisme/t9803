import React, { useState } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { Service } from '../types';

interface ServicesListProps {
  services: Service[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onDeleteService: (id: string) => void;
}

export function ServicesList({ services, onAddService, onDeleteService }: ServicesListProps) {
  const [newService, setNewService] = useState({ name: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name) return;
    
    onAddService(newService);
    setNewService({ name: '', description: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Services</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              placeholder="e.g., College Application Review"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Detailed service description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </form>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                {service.description && (
                  <Info className="h-4 w-4 text-gray-400" />
                )}
              </div>
              {service.description && (
                <p className="mt-1 text-sm text-gray-600">{service.description}</p>
              )}
            </div>
            <button
              onClick={() => onDeleteService(service.id)}
              className="text-red-600 hover:text-red-800 ml-4"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}