import React from 'react';
import { X, Clock } from 'lucide-react';
import { Request } from '../../types';
import StatusIndicator from '../StatusIndicator';

interface Props {
  request: Request;
  onClose: () => void;
  onUseRequest: () => void;
}

export default function RequestDetailsSidebar({ request, onClose, onUseRequest }: Props) {
  return (
    <div className="fixed top-0 right-0 bottom-0 w-96 bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Request Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Title</h4>
            <p className="text-white font-medium">{request.title}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-2">Status</h4>
            <StatusIndicator status={request.status} />
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-2">Details</h4>
            <p className="text-white whitespace-pre-wrap">{request.details}</p>
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-2">Preferred Dates</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-white">
                  Primary: {new Date(request.preferredDates.primary).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <p className="text-white">
                  Secondary: {new Date(request.preferredDates.secondary).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-2">Preferred Times</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(request.preferredTimes)
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <span key={key} className="px-2 py-1 bg-gray-700 rounded text-white text-sm">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-400 mb-2">Assessment Required</h4>
            <p className="text-white">{request.requiresAssessment ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onUseRequest}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Use Request Details
          </button>
        </div>
      </div>
    </div>
  );
}