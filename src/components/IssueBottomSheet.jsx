import React from 'react';

const IssueBottomSheet = ({ issue, onClose }) => {
  if (!issue) return null;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Issue Details</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close issue details"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Issue Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
            {issue.category || 'Pothole'}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xl font-bold text-gray-800 mb-3">
          {issue.title || 'Unnamed Issue'}
        </h4>

        {/* Issue Image */}
        <div className="relative w-full h-48 bg-gray-100 mb-4 rounded-lg overflow-hidden">
          {issue.image ? (
            <img 
              src={issue.image} 
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <div className="flex items-center text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Location</span>
          </div>
          <p className="text-gray-700 ml-6">{issue.location || 'Location not specified'}</p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h5 className="font-medium text-gray-800 mb-2">Description</h5>
          <p className="text-gray-700 leading-relaxed">
            {issue.description || 'No description provided.'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <h5 className="font-medium text-gray-800 mb-2">Progress</h5>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Completion Status</span>
            <span className="font-medium">{issue.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${issue.progress || 0}%` }}
            />
          </div>
          
          {/* Status Text */}
          <div className="flex items-center mt-3">
            <span className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(issue.progress)}`}></span>
            <span className="text-sm text-gray-600 font-medium">{getStatusText(issue.progress)}</span>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Follow Updates
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Report Similar
          </button>
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

// Helper function to get status color based on progress
const getStatusColor = (progress = 0) => {
  if (progress === 0) return 'bg-gray-500';
  if (progress < 30) return 'bg-yellow-500';
  if (progress < 70) return 'bg-blue-500';
  if (progress < 100) return 'bg-orange-500';
  return 'bg-green-500';
};

export default IssueBottomSheet;