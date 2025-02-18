// ================================
// 📌 FORM-RELATED PROP TYPES
// ================================

// 🔹 INPUT FIELD PROPS
export interface InputProps {
    label: string;
    value?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    name?: string;
  
    // Event Handlers
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    onReset?: (e: React.FormEvent<HTMLInputElement>) => void;
    onSubmit?: (e: React.FormEvent<HTMLInputElement>) => void;
    onSelect?: (e: React.FormEvent<HTMLInputElement>) => void;
    onInvalid?: (e: React.FormEvent<HTMLInputElement>) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    onCopy?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    onCut?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    onDrag?: (e: React.DragEvent<HTMLInputElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLInputElement>) => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseOver?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseOut?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onMouseMove?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;
    onScroll?: (e: React.UIEvent<HTMLInputElement>) => void;
  }
  
  // 🔹 BUTTON PROPS
  export interface ButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
  
    // Event Handlers
    onClick?: () => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }
  