import type { CheckboxGroupProps, Option } from '@/components/types/survey';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Icon } from '@iconify/react';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

export default function CheckboxGroup({ 
  question,
  updateQuestion,
  deleteQuestion 
}: CheckboxGroupProps) {
  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => question.options || [], [question.options]);

  const handleQuestionTextChange = useCallback((text: string) => {
    updateQuestion({ text });
  }, [updateQuestion]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for each option
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    updateQuestion({ options: updatedItems });
  }, [options, updateQuestion]);

  const handleDeleteOption = useCallback((optionId: string) => {
    if (options.length <= 2) {
      toast.error('Checkbox groups must have at least two options');
      return;
    }

    const updatedOptions = options.filter(opt => opt.id !== optionId)
      .map((opt, index) => ({ ...opt, order: index }));
    updateQuestion({ options: updatedOptions });
  }, [options, updateQuestion]);

  const handleAddOption = useCallback(() => {
    const newOption: Option = {
      id: crypto.randomUUID(),
      text: '',
      value: '',
      order: options.length,
      isValid: true,
      validationType: 'none' as const
    };

    updateQuestion({ 
      options: [...options, newOption]
    });
  }, [options, updateQuestion]);

  const handleUpdateOption = useCallback((optionId: string, value: string) => {
    const updatedOptions = options.map(opt =>
      opt.id === optionId 
        ? { ...opt, text: value, value } 
        : opt
    );
    updateQuestion({ options: updatedOptions });
  }, [options, updateQuestion]);

  const handleMoveOption = useCallback((optionId: string, direction: 'up' | 'down') => {
    const index = options.findIndex(opt => opt.id === optionId);
    if (index === -1) return;

    const newOptions = [...options];
    if (direction === 'up' && index > 0) {
      [newOptions[index - 1], newOptions[index]] = [newOptions[index], newOptions[index - 1]];
    } else if (direction === 'down' && index < newOptions.length - 1) {
      [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
    }

    // Update order property
    const updatedOptions = newOptions.map((opt, idx) => ({
      ...opt,
      order: idx
    }));

    updateQuestion({ options: updatedOptions });
  }, [options, updateQuestion]);

  return (
    <div className="space-y-4 bg-white p-4 border border-gray-300 rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={question.text}
          onChange={(e) => handleQuestionTextChange(e.target.value)}
          placeholder="Enter your question"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-itg-red focus:border-itg-red"
          aria-label="Question text"
        />
        <button
          type="button"
          onClick={() => deleteQuestion(question.id)}
          className="ml-2 p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
          title="Delete question"
          aria-label="Delete question"
        >
          <Icon icon="mdi:delete" className="w-5 h-5" />
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`checkbox-options-${question.id}`}>
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="space-y-2"
            >
              {options.map((option, index) => (
                <Draggable 
                  key={option.id} 
                  draggableId={option.id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center space-x-2 bg-white p-2 border 
                        border-gray-300 rounded-md transition-shadow
                        ${snapshot.isDragging ? 'shadow-lg ring-2 ring-itg-red' : ''}`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-move p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Icon icon="mdi:drag" className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md
                          focus:ring-itg-red focus:border-itg-red"
                        aria-label={`Option ${index + 1}`}
                      />
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => handleMoveOption(option.id, 'up')}
                          disabled={index === 0}
                          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50
                            transition-colors"
                          title="Move up"
                          aria-label="Move option up"
                        >
                          <Icon icon="mdi:arrow-up" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOption(option.id, 'down')}
                          disabled={index === options.length - 1}
                          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50
                            transition-colors"
                          title="Move down"
                          aria-label="Move option down"
                        >
                          <Icon icon="mdi:arrow-down" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(option.id)}
                          className="p-2 hover:bg-red-100 rounded-full text-red-600
                            transition-colors"
                          title="Delete option"
                          aria-label="Delete option"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        onClick={handleAddOption}
        className="text-sm text-itg-red hover:text-red-700 transition-colors"
        aria-label="Add new option"
      >
        + Add Option
      </button>
    </div>
  );
}


