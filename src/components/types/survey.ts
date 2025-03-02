import { BaseEntity, ValidationRules, ValidationType } from "./common";
import type { UserData as AuthUserData, UserRole } from './auth';

// ================================
// 📌 OPTION TYPE
// ================================
export interface Option extends BaseEntity {
  text: string;
  value: string;
  order: number;
  id: string;
  isValid: boolean;
  validation?: ValidationRules;
  validationType: ValidationType;
  validationError?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

// ================================
// 📌 QUESTION TYPE
// ================================
export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "rating"
  | "date"
  | "number"
  | "email"
  | "phone"
  | "url"
  | "dropdown"
  | "matrix"
  | "slider"
  | "star"
  | "yes_no"
  | "legal"
  | "section"
  | "group"
  | "address"
  | "time"
  | "image"
  | "video"
  | "audio"
  | "statement"
  | "signature"
  | "payment"
  | "single_choice"
  | "file_upload"
  | "date_time"
  | "text"
  | "likert_scale"
  | "range"
  | "multi_select"
  | "multi_text"
  | "nested"
  | "net_promoter_score"
  | "radio"
  | "matrix_radio"
  | "matrix_checkbox";
  

  export interface Question extends BaseEntity {
    id: string;
    sectionId: string;
    survey_id: string; // Add this field
    type: QuestionType;
    text: string;
    required: boolean;
    options: Option[]; // Keep the Option[] type instead of string[]
    isValid: boolean;
    order: number;
    isFirst: boolean;
    isLast: boolean;
    helpText?: string;
    placeholder?: string;
    validation?: ValidationRules;
    validationType: ValidationType;
    validationError?: string;
    disabled?: boolean;
    minRange?: number;
    maxRange?: number;
    step?: number;
    fileTypesAllowed?: string[];
    maxFileSize?: number;
    mediaUrl?: string;
    signatureRequired?: boolean;
    legalAgreementText?: string;
    netPromoterScoreScale?: 5 | 7 | 10;
    onChange: (type: QuestionType) => void;
    form?: {
      label: string;
      name: string;
      value: string;
      type: string;
    };
  }

// ================================
// 📌 SECTION TYPE
// ================================
export interface Section extends BaseEntity {
  id: string;
  title: string;
  description?: string;
  order: number;
  survey_id: string;
  questions?: Question[];
}

// ================================
// 📌 SURVEY TYPE
// ================================
export interface Survey extends BaseEntity {
  title: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  sections: Section[];
  isPublished: boolean;
  userId: string;
  validation?: ValidationRules;
  responses_count?: number;
  status: 'active' | 'draft' | 'closed';
  responses?: Array<{ count: number }>;
  questions?: Question[];
  user_id: string;
}

// ================================
// 📌 FORM PROP TYPES
// ================================
export interface QuestionFormProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  sections: Section[];
  section: Section;
  setQuestions: (questions: Question[]) => void;
  deleteQuestion: (questionId: string) => void;
}

export interface SectionProps {
  section: Section;
  sections: Section[];
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateSection: (updates: Partial<Section>) => void;
  deleteSection: () => void;
  index?: number; // Add index as optional prop
}

export interface SurveyFormProps {
  survey: Survey;
  onUpdate: (updates: Partial<Survey>) => void;
  onPublish: () => void;
  deleteQuestion: (questionId: string) => void;
}

export interface QuestionTypeSelectorProps {
  type: QuestionType;
  disabled: boolean;
  onChange: (newType: QuestionType) => void;
  deleteQuestion: (questionId: string) => void;
}

export interface CheckboxGroupProps {
  question: Question;
  updateQuestion: (updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  deleteOption: (optionId: string) => void;
  addOption: () => void;
  updateOption: (optionId: string, value: string) => void;
  moveOption: (optionId: string, direction: "up" | "down") => void;
  moveUp: (optionId: string) => void;
  moveDown: (optionId: string) => void;
  options: Option[];
}

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  sections?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  questions?: Question[];
}

export interface UserData extends AuthUserData {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  status: string;
  email_verified: boolean;
  last_sign_in_at?: string;
  role: UserRole;
}

