export interface CookingStep {
  number: number;
  text: string;
  totalSteps: number;
}

export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

export interface SafetyWarning {
  id: string;
  message: string;
  type: 'danger' | 'warning';
}
