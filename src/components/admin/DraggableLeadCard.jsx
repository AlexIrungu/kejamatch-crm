import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mail, Phone, Calendar, User, GripVertical, Eye } from 'lucide-react';

const DraggableLeadCard = ({ lead, onViewDetails, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id || lead._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 ${
        isDragging ? 'shadow-xl ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="p-4">
        {/* Drag Handle & Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
            >
              <GripVertical className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{lead.name}</h4>
              {lead.subject && (
                <p className="text-xs text-gray-500 truncate mt-1">{lead.subject}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onViewDetails(lead)}
            className="text-gray-400 hover:text-primary transition-colors flex-shrink-0"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
          {(lead.phoneNumber || lead.phone) && (
            <div className="flex items-center text-xs text-gray-600">
              <Phone className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
              <span>{lead.phoneNumber || lead.phone}</span>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(lead.createdAt)}
          </div>
          {lead.assignedToName && (
            <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <User className="w-3 h-3 mr-1" />
              <span className="truncate max-w-[100px]">{lead.assignedToName}</span>
            </div>
          )}
        </div>

        {/* Activity Count Badge */}
        {lead.activities && lead.activities.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="inline-flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-1.5"></span>
              {lead.activities.length} {lead.activities.length === 1 ? 'activity' : 'activities'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableLeadCard;