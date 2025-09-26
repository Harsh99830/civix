import React from 'react';

const IssueBottomSheet = ({ issue, onClose }) => {
  if (!issue) return null;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-base font-semibold text-gray-800">Issue Details</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close issue details"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Issue Content */}
      <div className="p-3">
        {/* Category and Title in one line */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold">
            {issue.category || 'Pothole'}
          </span>
          <h4 className="text-base font-bold text-gray-800 flex-1 line-clamp-1">
            {issue.title || 'Unnamed Issue'}
          </h4>
        </div>

        {/* Issue Image */}
        <div className="relative w-full h-32 bg-gray-100 mb-2 rounded overflow-hidden">
          {issue.image ? (
            <img 
              src={issue.image} 
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <svg className="w-3.5 h-3.5 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{issue.location || 'Location not specified'}</span>
        </div>

        {/* Description */}
        <div className="mb-2">
          <h5 className="text-xs font-semibold text-gray-700 mb-1">Description</h5>
          <p className="text-xs text-gray-600 leading-snug line-clamp-3">
            {issue.description || 'No description provided.'}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <h5 className="text-xs font-semibold text-gray-700">Progress</h5>
            <span className={`text-xs font-medium ${getStatusColor(issue.progress)}`}>
              {getStatusText(issue.progress)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-0.5">
            <div 
              className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${issue.progress || 0}%` }}
            />
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">
              {issue.progress || 0}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-2">
          <button
            className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            onClick={() => {}}
          >
            Upvote
          </button>
          <button
            className="flex-1 py-1.5 px-3 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
            onClick={() => {}}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
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