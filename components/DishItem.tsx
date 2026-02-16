
import React, { useState } from 'react';
import { Dish, Comment } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DishItemProps {
  dish: Dish;
  currentUserId: string;
  isAdmin: boolean;
  isPotluckLocked: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddComment: (dishId: number, text: string) => void;
  onDeleteComment: (dishId: number, commentId: string) => void;
}

const DishItem: React.FC<DishItemProps> = ({ 
  dish, 
  currentUserId, 
  isAdmin, 
  isPotluckLocked, 
  onEdit, 
  onDelete,
  onAddComment,
  onDeleteComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const categoryColor = CATEGORY_COLORS[dish.category];
  
  // Rule: Admins can always modify. Users can modify their own dish ONLY if potluck is not locked.
  const canModify = isAdmin || (dish.userId === currentUserId && !isPotluckLocked);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(dish.id, commentText);
      setCommentText('');
      setShowComments(true);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md bg-gray-50/50">
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        {dish.imageUrl && (
          <img 
            src={dish.imageUrl} 
            alt={dish.dishName} 
            className="w-full sm:w-24 sm:h-24 h-48 object-cover rounded-md flex-shrink-0 border border-gray-100"
            aria-hidden="true" 
          />
        )}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{dish.dishName}</h3>
            <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                <span>Brought by:</span>
                <span className="font-bold text-gray-700">{dish.personName}</span>
                {dish.userDietaryRestrictions && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1 ${dish.isDietaryRestrictionSerious ? 'bg-red-600 text-white border-red-700 shadow-sm animate-pulse-subtle' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {dish.isDietaryRestrictionSerious && <span role="img" aria-label="serious" title="EXTRA serious">💀</span>}
                      ({dish.userDietaryRestrictions})
                    </span>
                )}
                {dish.hasPlusOne && (
                    <span className="font-medium text-green-600"> + {dish.plusOneName || 'Plus One'}</span>
                )}
            </div>
            {dish.allergens && (
              <p className="text-sm text-yellow-800 mt-2 bg-yellow-50/50 px-2 py-1 rounded border border-yellow-100/50">
                <span className="font-semibold">Dish Allergens:</span> {dish.allergens}
              </p>
            )}
            {dish.extras && (
              <p className="text-sm text-indigo-700 mt-1">
                <span className="font-semibold">Extras:</span> {dish.extras}
              </p>
            )}
            {dish.isParticipatingInCookieSwap && (
              <p className="text-sm text-yellow-700 mt-2 bg-yellow-50 inline-block px-2 py-1 rounded border border-yellow-200 shadow-sm">
                  🍪 <span className="font-semibold">CBC Holiday Cookie Swap:</span> {dish.cookieSwapDescription || 'Participating'}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${categoryColor}`}>
                    {dish.category}
                </span>
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="text-xs text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm"
                >
                  💬 {dish.comments?.length || 0} Comments
                </button>
            </div>
            
            {canModify && (
              <div className="flex items-center gap-3">
                  <button onClick={onEdit} aria-label={`Edit ${dish.dishName}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
                  <button onClick={onDelete} aria-label={`Delete ${dish.dishName}`} className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors">Delete</button>
              </div>
            )}
            {isPotluckLocked && !isAdmin && dish.userId === currentUserId && (
                <span className="text-[10px] text-gray-400 italic flex items-center gap-1">
                    <span>🔒</span> Read-only (Archived)
                </span>
            )}
          </div>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="bg-gray-100/50 border-t border-gray-200 p-4 animate-fadeIn">
          <div className="space-y-3 mb-4">
            {dish.comments && dish.comments.length > 0 ? (
              dish.comments.map((comment) => (
                <div key={comment.id} className="group flex flex-col bg-white p-3 rounded-lg shadow-sm border border-gray-100 relative">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-gray-800">{comment.userName}</span>
                    <span className="text-[10px] text-gray-400">{formatDate(comment.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">{comment.text}</p>
                  {(isAdmin || comment.userId === currentUserId) && (
                    <button 
                      onClick={() => onDeleteComment(dish.id, comment.id)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete comment"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-gray-400 py-2">No comments yet. Start the conversation!</p>
            )}
          </div>
          
          <form onSubmit={handlePostComment} className="flex gap-2">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow text-sm px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DishItem;
