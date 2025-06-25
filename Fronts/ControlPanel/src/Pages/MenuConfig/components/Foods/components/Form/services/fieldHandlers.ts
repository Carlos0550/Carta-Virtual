import type { FoodForm } from '@/Context/HookTypes/FoodTypes';

export function handleTagsChange(
  field: keyof Pick<FoodForm, 'food_tags' | 'food_ingredients'>,
  value: string[],
  setFormData: (data: Partial<FoodForm>) => void
) {
  setFormData({ [field]: value });
}

export function handleDescriptionChange(
  value: string,
  setFormData: (data: Partial<FoodForm>) => void
) {
  setFormData({ food_description: value });
}

export function handleCautionsChange(
  value: string,
  setFormData: (data: Partial<FoodForm>) => void
) {
  setFormData({ food_cautions: value });
}

export function onTagsChange(
  setFormData: (updater: (prev: FoodForm) => FoodForm) => void
) {
  return (field: keyof Pick<FoodForm, 'food_tags' | 'food_ingredients'>, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
}

export function onDescriptionChange(
  setFormData: (updater: (prev: FoodForm) => FoodForm) => void
) {
  return (value: string) => {
    setFormData(prev => ({ ...prev, food_description: value }));
  };
}

export function onCautionsChange(
  setFormData: (updater: (prev: FoodForm) => FoodForm) => void
) {
  return (value: string) => {
    setFormData(prev => ({ ...prev, food_cautions: value }));
  };
}

export function onClearImage(
  setFileData: (file: File | null) => void
) {
  return () => {
    setFileData(null);
  };
} 