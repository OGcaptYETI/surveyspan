// ================================
// 📌 COMMON UTILITY TYPES
// ================================

import { Option } from "./survey";

// 🔹 Base Entity (Shared for all models)
export interface BaseEntity {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // 🔹 Validation Rules
  export interface ValidationRules {
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    message: string;
    options?: Option[];
    type: ValidationType;
  }
  
  // 🔹 Validation Types
  export type ValidationType =
    | "none"
    | "email"
    | "url"
    | "phone"
    | "date"
    | "number"
    | "text"
    | "regex"
    | "required"
    | "pattern"
    | "custom"
    | "options"
    | "length"
    | "range"
    | "rating";
  