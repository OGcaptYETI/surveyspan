import type { Question, Option } from "@/components/types/survey";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";

interface MultipleChoiceProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
}

export default function MultipleChoice({ question, updateQuestion }: MultipleChoiceProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(question.options || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateQuestion({ options: items });
  };

  const addOption = () => {
    const newOption: Option = {
      id: crypto.randomUUID(),
      text: "",
      value: "",
      order: (question.options?.length || 0),
      isValid: true,
      validationType: "none",
      onChange: () => {},
    };
    updateQuestion({ options: [...(question.options || []), newOption] });
  };

  return (
    <div className="space-y-4 bg-white p-4 border border-gray-300 rounded-md shadow-sm">
      {/* Admin Input - Enter Question */}
      <input
        type="text"
        value={question.text || ""}
        onChange={(e) => updateQuestion({ text: e.target.value })}
        placeholder="Enter your question"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-itg-red focus:border-transparent font-semibold"
      />

      {/* Respondent Options with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="multipleChoiceOptions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {question.options?.map((option, index) => (
                <Draggable key={option.id} draggableId={option.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center space-x-2 bg-white p-2 border border-gray-300 rounded-md"
                    >
                      <Icon icon="mdi:drag" className="text-gray-400 cursor-move" />
                      <input
                        type="text"
                        value={option.text || ""}
                        required
                        onChange={(e) =>
                          updateQuestion({
                            options: question.options?.map((opt, idx) =>
                              idx === index ? { ...opt, text: e.target.value } : opt
                            ),
                          })
                        }
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <button
                        title="Remove option"
                        onClick={() => {
                          updateQuestion({ options: question.options?.filter((_, idx) => idx !== index) });
                        }}
                        className="p-2 hover:bg-red-100 rounded-full text-red-600"
                      >
                        <Icon icon="mdi:close" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Option Button */}
      <button onClick={addOption} className="text-sm text-itg-red hover:text-red-700">
        + Add Option
      </button>
    </div>
  );
}


