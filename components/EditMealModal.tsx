'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Check } from 'lucide-react';
import { MealLog, FoodItem, MealType } from '@/types/nutrition';

interface EditMealModalProps {
  isOpen: boolean;
  meal: MealLog | null;
  onClose: () => void;
  onSave: (updatedMeal: MealLog) => void;
}

export const EditMealModal: React.FC<EditMealModalProps> = ({
  isOpen,
  meal,
  onClose,
  onSave,
}) => {
  const [editedItems, setEditedItems] = useState<FoodItem[]>([]);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (meal) {
      setEditedItems(JSON.parse(JSON.stringify(meal.items)));
      setMealType(meal.mealType);
      setPrompt(meal.prompt);
    }
  }, [meal]);

  if (!isOpen || !meal) return null;

  const handleItemChange = (index: number, field: keyof FoodItem, value: string | number) => {
    setEditedItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: typeof value === 'number' ? Math.max(0, value) : value,
      };
      return updated;
    });
  };

  const handleAddItem = () => {
    const newItem: FoodItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: 'New Food Item',
      servingSize: '1 portion',
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 2,
    };
    setEditedItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    return editedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + Number(item.calories || 0),
        protein: Math.round((acc.protein + Number(item.protein || 0)) * 10) / 10,
        carbs: Math.round((acc.carbs + Number(item.carbs || 0)) * 10) / 10,
        fat: Math.round((acc.fat + Number(item.fat || 0)) * 10) / 10,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleSave = () => {
    const totals = calculateTotals();
    const updatedMeal: MealLog = {
      ...meal,
      prompt,
      mealType,
      items: editedItems,
      totals,
    };
    onSave(updatedMeal);
    onClose();
  };

  const currentTotals = calculateTotals();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div>
            <h3 className="text-base font-bold text-white">Adjust Logged Meal & Items</h3>
            <p className="text-xs text-slate-400">Fine-tune food quantities or macronutrient estimates</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Meal Type & Prompt */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Meal Prompt Description
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs rounded-xl px-3.5 py-2 border border-slate-800 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-cyan-400"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          {/* Food Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Individual Food Items ({editedItems.length})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {editedItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
                >
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6 sm:col-span-5">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        placeholder="Food Item Name"
                        className="w-full bg-slate-900 text-white text-xs font-medium rounded-lg px-2.5 py-1.5 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-6">
                      <input
                        type="text"
                        value={item.servingSize}
                        onChange={(e) => handleItemChange(idx, 'servingSize', e.target.value)}
                        placeholder="Portion / Serving Size"
                        className="w-full bg-slate-900 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Macros Row */}
                  <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Calories</span>
                      <input
                        type="number"
                        value={item.calories}
                        onChange={(e) => handleItemChange(idx, 'calories', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-cyan-300 rounded px-2 py-1 border border-slate-800 focus:border-cyan-400 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-500 uppercase block font-sans">Protein (g)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={item.protein}
                        onChange={(e) => handleItemChange(idx, 'protein', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-emerald-400 rounded px-2 py-1 border border-slate-800 focus:border-emerald-400 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-500 uppercase block font-sans">Carbs (g)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={item.carbs}
                        onChange={(e) => handleItemChange(idx, 'carbs', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-amber-400 rounded px-2 py-1 border border-slate-800 focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-500 uppercase block font-sans">Fat (g)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={item.fat}
                        onChange={(e) => handleItemChange(idx, 'fat', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 text-rose-400 rounded px-2 py-1 border border-slate-800 focus:border-rose-400 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Calculated Totals */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400">Calculated:</span>
            <span className="text-cyan-400 font-bold">{currentTotals.calories} kcal</span>
            <span className="text-emerald-400">{currentTotals.protein}g P</span>
            <span className="text-amber-400">{currentTotals.carbs}g C</span>
            <span className="text-rose-400">{currentTotals.fat}g F</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
