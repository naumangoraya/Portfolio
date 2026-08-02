'use client';

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Vertical drag-and-drop list. This is the ONLY file in the app that imports
 * @dnd-kit - everything else reorders through `onReorder(nextArray)`.
 *
 * A KeyboardSensor is wired up alongside the pointer sensor so the list is
 * reorderable without a mouse: focus the drag handle, press Space/Enter to
 * pick up, arrow keys to move, Space/Enter to drop, Escape to cancel.
 */

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledRow = styled.li`
  position: relative;
  list-style: none;
  border-radius: var(--border-radius);

  &[data-dragging='true'] {
    z-index: 10;
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
  }
`;

const SortableRow = ({ id, item, renderItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const dragHandleProps = useMemo(
    () => ({
      ...attributes,
      ...listeners,
      ref: setActivatorNodeRef,
      type: 'button',
      'aria-label': attributes?.['aria-label'] || 'Drag to reorder',
    }),
    [attributes, listeners, setActivatorNodeRef]
  );

  return (
    <StyledRow ref={setNodeRef} style={style} data-dragging={isDragging}>
      {renderItem(item, { dragHandleProps, isDragging })}
    </StyledRow>
  );
};

SortableRow.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  item: PropTypes.any,
  renderItem: PropTypes.func.isRequired,
};

const SortableList = ({ items = [], getId, onReorder, renderItem, className }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const resolveId = useCallback(
    (item, index) => {
      const raw = getId ? getId(item, index) : (item?._id ?? item?.id ?? index);
      return String(raw);
    },
    [getId]
  );

  const ids = useMemo(() => items.map(resolveId), [items, resolveId]);

  const handleDragEnd = useCallback(
    event => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = ids.indexOf(String(active.id));
      const newIndex = ids.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return;

      onReorder(arrayMove(items, oldIndex, newIndex));
    },
    [ids, items, onReorder]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <StyledList className={className}>
          {items.map((item, index) => {
            const id = ids[index];
            return <SortableRow key={id} id={id} item={item} renderItem={renderItem} />;
          })}
        </StyledList>
      </SortableContext>
    </DndContext>
  );
};

SortableList.propTypes = {
  items: PropTypes.array,
  getId: PropTypes.func,
  onReorder: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SortableList;
