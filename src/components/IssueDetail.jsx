import React from 'react';
import pothole1 from '../assets/pothole1.png'
const IssueDetail = ({ issue }) => {
  if (!issue) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden my-4">
      {/* Issue Image */}
      <div className="relative h-48 bg-gray-100">
          <img 
            src={pothole1} 
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        
      </div>

      {/* Issue Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
            {issue.category || 'Pothole'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {issue.title || 'Unnamed Issue'}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {issue.description || 'No description provided.'}
        </p>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{issue.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${issue.progress || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center text-sm text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          <span>{getStatusText(issue.progress)}</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status text based on progress
const getStatusText = (progress = 0) => {
  if (progress === 0) return 'Reported';
  if (progress < 30) return 'In Review';
  if (progress < 70) return 'In Progress';
  if (progress < 100) return 'Almost Done';
  return 'Resolved';
};

export default IssueDetail;
