// types/survey.ts

export type ValidationType = 'none' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'text' | 'regex';

export type QuestionType = 
'short_text' | 'long_text' | 'multiple_choice' | 'checkbox' | 'rating' | 
'date' | 'number' | 'email' | 'phone' | 'url' | 'file' | 'dropdown' | 
'matrix' | 'slider' | 'star' | 'yes_no' | 'legal' | 'section'| 'group' |
'address' | 'time' | 'image' | 'video' | 'audio' | 'statement' | 'signature'|
'payment' | 'single_choice' | 'file_upload' | 'rating' | 'date_time' | 'time' | 'text'| 'type'| 'short_text';


export interface Option {
  id: string;
  text: string;
  value: string;
  order: number;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  sections: Section[];
  setSections: (sections: Section[]) => void;
}

export interface Question {

  updateValidationOption: (index: number, value: string) => void;
  setValidationText: (text: string) => void;
  setValidationType: (type: string) => void;
  setValidationOptions: (options: string[]) => void;
  isFirst: boolean;
  isLast: boolean;
  id: string;
  sectionId: string;
  isValid: boolean;
  validationError: string;
  validationType: ValidationType;
  validationText: string;
  validationOptions: Option[];
  setType: (type: QuestionType) => void;
  setRequired: (required: boolean) => void;
  setText: (text: string) => void;
  type: QuestionType;
  text: string;
  required: boolean;
  options: Array<{
    id: string;
    text: string;
    value: string;
  }>;
  placeholder?: string;
  helpText?: string;
  validation?: {
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    options: {
      id: string;
      text: string;
      value: string;
    }[];
  };
  order: number;
  setOptions: (options: Option[]) => void;
  addOption: () => void;
  deleteOption: (optionId: string) => void;
  updateOption: (optionId: string, updates: Partial<Option>) => void;
  moveOption: (optionId: string, direction: 'up' | 'down') => void;
  updateValidation: (updates: Partial<Question['validation']>) => void;
  moveValidationOption: (direction: 'up' | 'down') => void;
  addValidationOption: () => void;
  deleteValidationOption: (optionId: string) => void;
  setValidation: (validation: Partial<Question['validation']>) => void;
  moveOptionsUp: () => void;
  moveOptionsDown: () => void;
  duplicateOption: () => void;
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  sections: Section[];
  section: Section[];
  setSections: (sections: Section[]) => void;
  setHelpText: (text: string) => void;
  setPlaceholder: (text: string) => void;
  moveUp: () => void;
  moveDown: () => void;
  duplicateQuestion: () => void;
  handleSetOptions: (options: Option[]) => void;
  handleAddOption: () => void;
  handleDeleteOption: (optionId: string) => void;
  handleSetType: (type: QuestionType) => void;
  handleSetText: (text: string) => void;
  handleSetRequired: (required: boolean) => void;
  handleSetHelpText: (text: string) => void;
  handleSetPlaceholder: (text: string) => void;
  handleDeleteQuestion: () => void;
  handleDuplicate: () => void;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublished: boolean;
  validation?: {
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  };
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  addOption: (questionId: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, updates: Partial<Option>) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  moveOption: (questionId: string, optionId: string, direction: 'up' | 'down') => void;
  updateValidation: (questionId: string, updates: Partial<Question['validation']>) => void;
  setQuestions: (questions: Question[]) => void;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  responses: {
    questionId: string;
    value: string | string[];
  }[];
  submittedAt: string;
  respondentEmail?: string;
  respondentName?: string;
  respondentId?: string;
  validation?: {
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  };
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  addOption: (questionId: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, updates: Partial<Option>) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  moveOption: (questionId: string, optionId: string, direction: 'up' | 'down') => void;
  updateValidation: (questionId: string, updates: Partial<Question['validation']>) => void;
  setQuestions: (questions: Question[]) => void;
  setResponses: (responses: SurveyResponse[]) => void;
  addResponse: (response: SurveyResponse) => void;
  updateResponse: (responseId: string, updates: Partial<SurveyResponse>) => void;
  deleteResponse: (responseId: string) => void;
  moveResponse: (responseId: string, direction: 'up' | 'down') => void;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublished: boolean;
  validation?: {
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
  };
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  addOption: (questionId: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, updates: Partial<Option>) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  moveOption: (questionId: string, optionId: string, direction: 'up' | 'down') => void;
  updateValidation: (questionId: string, updates: Partial<Question['validation']>) => void;
  setQuestions: (questions: Question[]) => void;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  addOption: (questionId: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, updates: Partial<Option>) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  moveOption: (questionId: string, optionId: string, direction: 'up' | 'down') => void;
  updateValidation: (questionId: string, updates: Partial<Question['validation']>) => void;
  setQuestions: (questions: Question[]) => void;
}

export interface Sections {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  addOption: (questionId: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, updates: Partial<Option>) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  moveOption: (questionId: string, optionId: string, direction: 'up' | 'down') => void;
  updateValidation: (questionId: string, updates: Partial<Question['validation']>) => void;
}

export interface SectionType {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: (sectionId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  addOption: (questionId: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, updates: Partial<Option>) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  moveOption: (questionId: string, optionId: string, direction: 'up' | 'down') => void;
  updateValidation: (questionId: string, updates: Partial<Question['validation']>) => void;
}

export interface QuestionFormProps {
  questions: Question[];
  section: Section;
  sections: Section[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  moveQuestion: (questionId: string, direction: 'up' | 'down') => void;
  addSection: () => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: () => void;
  setSections: (sections: Section[]) => void;
}

export interface InputProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  inputMode?: string;
  list?: string;
  maxLength?: number;
  minLength?: number;
  size?: number;
  tabIndex?: number;
  title?: string;
  form?: string;
  accept?: string;
  multiple?: boolean;
  checked?: boolean;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  height?: number;
  width?: number;
  cols?: number;
  rows?: number;
  wrap?: string;
  disabledOptions?: string[];
  options?: string[];
  selected?: string;
  onChangeSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInvalid?: (e: React.FormEvent<HTMLInputElement>) => void;
  onReset?: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLInputElement>) => void;
  onSelect?: (e: React.FormEvent<HTMLInputElement>) => void;
  onSearch?: (e: React.FormEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onCopy?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onCut?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onDrag?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragExit?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragStart?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLInputElement>) => void;
  onScroll?: (e: React.UIEvent<HTMLInputElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onContextMenu?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onDragEndCapture?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragEnterCapture?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragLeaveCapture?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragOverCapture?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDragStartCapture?: (e: React.DragEvent<HTMLInputElement>) => void;
  onDropCapture?: (e: React.DragEvent<HTMLInputElement>) => void;
  onFocusCapture?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlurCapture?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onCopyCapture?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onCutCapture?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onPasteCapture?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onScrollCapture?: (e: React.UIEvent<HTMLInputElement>) => void;
  onWheelCapture?: (e: React.WheelEvent<HTMLInputElement>) => void;
  onInvalidCapture?: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmitCapture?: (e: React.FormEvent<HTMLInputElement>) => void;
  onResetCapture?: (e: React.FormEvent<HTMLInputElement>) => void;
  onSelectCapture?: (e: React.FormEvent<HTMLInputElement>) => void;
  onSearchCapture?: (e: React.FormEvent<HTMLInputElement>) => void;
  onKeyUpCapture?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDownCapture?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPressCapture?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputCapture?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickCapture?: () => void;
  onContextMenuCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onDoubleClickCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseDownCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseEnterCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseLeaveCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseMoveCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseOutCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseOverCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseUpCapture?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

export interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  tabIndex?: number;
  title?: string;
  value?: string;
  name?: string;
  id?: string;
  onClickCapture?: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onContextMenuCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDoubleClickCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDownCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnterCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeaveCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseMoveCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseOutCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseOver?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseOverCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUpCapture?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDrag?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEndCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnterCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragExit?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragExitCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragLeaveCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragOverCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragStartCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDropCapture?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onScroll?: (e: React.UIEvent<HTMLButtonElement>) => void;
  onScrollCapture?: (e: React.UIEvent<HTMLButtonElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLButtonElement>) => void;
  onWheelCapture?: (e: React.WheelEvent<HTMLButtonElement>) => void;
  onInvalid?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onInvalidCapture?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onSubmitCapture?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onReset?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onResetCapture?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onSelect?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onSelectCapture?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onSearch?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onSearchCapture?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onCopy?: (e: React.ClipboardEvent<HTMLButtonElement>) => void;
  onCopyCapture?: (e: React.ClipboardEvent<HTMLButtonElement>) => void;
  onCut?: (e: React.ClipboardEvent<HTMLButtonElement>) => void;
  onCutCapture?: (e: React.ClipboardEvent<HTMLButtonElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLButtonElement>) => void;
  onPasteCapture?: (e: React.ClipboardEvent<HTMLButtonElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyPressCapture?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyDownCapture?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUpCapture?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onInput?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onInputCapture?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlurCapture?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onFocusCapture?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onChange?: (e: React.FormEvent<HTMLButtonElement>) => void;
  onChangeCapture?: (e: React.FormEvent<HTMLButtonElement>) => void;
}

export interface SectionProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateSection: (updates: Partial<{ title: string; description: string }>) => void;
  deleteSection: () => void;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: () => void;
}



