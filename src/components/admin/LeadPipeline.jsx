import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import PipelineColumn from './PipelineColumn';
import DraggableLeadCard from './DraggableLeadCard';

const LeadPipeline = ({ leads, onStatusChange, onViewDetails, loading }) => {
  const [activeId, setActiveId] = useState(null);

  // Define pipeline stages
  const stages = [
    { id: 'new', label: 'New Leads', color: 'bg-blue-500' },
    { id: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
    { id: 'qualified', label: 'Qualified', color: 'bg-indigo-500' },
    { id: 'viewing', label: 'Viewing', color: 'bg-yellow-500' },
    { id: 'negotiating', label: 'Negotiating', color: 'bg-orange-500' },
    { id: 'won', label: 'Won', color: 'bg-green-500' },
    { id: 'lost', label: 'Lost', color: 'bg-red-500' },
  ];

  // Group leads by status
  const groupedLeads = stages.reduce((acc, stage) => {
    acc[stage.id] = leads.filter((lead) => lead.status === stage.id);
    return acc;
  }, {});

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Check if we're dragging over a column (not another card)
    const isOverColumn = stages.some((stage) => stage.id === overId);
    if (isOverColumn) {
      // We'll handle the status change on drop
      return;
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the lead being dragged
    const activeLead = leads.find((lead) => lead.id === activeId || lead._id === activeId);
    if (!activeLead) return;

    // Determine the new status
    let newStatus = null;

    // Check if dropped on a column
    const targetStage = stages.find((stage) => stage.id === overId);
    if (targetStage) {
      newStatus = targetStage.id;
    } else {
      // Dropped on another card - find which column it belongs to
      const targetLead = leads.find((lead) => lead.id === overId || lead._id === overId);
      if (targetLead) {
        newStatus = targetLead.status;
      }
    }

    // Only update if status changed
    if (newStatus && activeLead.status !== newStatus) {
      try {
        await onStatusChange(activeLead, newStatus);
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Find the active lead for the drag overlay
  const activeLead = activeId ? leads.find((lead) => lead.id === activeId || lead._id === activeId) : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          {stages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              leads={groupedLeads[stage.id]}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="transform rotate-3 opacity-90">
              <DraggableLeadCard lead={activeLead} isDragging onViewDetails={onViewDetails} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default LeadPipeline;