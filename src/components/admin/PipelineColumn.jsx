import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableLeadCard from './DraggableLeadCard';

const PipelineColumn = ({ stage, leads, onViewDetails }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg h-full flex flex-col">
        {/* Column Header */}
        <div className={`${stage.color} text-white px-4 py-3 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{stage.label}</h3>
            <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs font-medium">
              {leads.length}
            </span>
          </div>
        </div>

        {/* Column Content */}
        <div
          ref={setNodeRef}
          className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px] transition-colors ${
            isOver ? 'bg-blue-50 ring-2 ring-blue-400 ring-inset' : ''
          }`}
        >
          <SortableContext
            items={leads.map((lead) => lead.id || lead._id)}
            strategy={verticalListSortingStrategy}
          >
            {leads.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                <p>Drop leads here</p>
              </div>
            ) : (
              leads.map((lead) => (
                <DraggableLeadCard
                  key={lead.id || lead._id}
                  lead={lead}
                  onViewDetails={onViewDetails}
                />
              ))
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default PipelineColumn;