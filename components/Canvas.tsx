import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormBuilderContext } from '../App';
import { CanvasField } from './CanvasField';
import { FormFieldRenderer, RenderProgressTracker } from './FormFields';
import { FieldType, FormFieldInstance, LogicRule, ConditionGroup, FormSettings, CalculatedField } from '../types';
import { Button } from './ui';
import { produce } from 'immer';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-slate-500">
        <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
);

// --- Logic Engine ---
const evaluateCondition = (condition: any, formValues: any): boolean => {
    const sourceValue = formValues[condition.sourceField];
    const targetValue = condition.value;

    switch (condition.operator) {
        case 'eq': return sourceValue == targetValue;
        case 'neq': return sourceValue != targetValue;
        case 'gt': return Number(sourceValue) > Number(targetValue);
        case 'lt': return Number(sourceValue) < Number(targetValue);
        case 'contains': return String(sourceValue).includes(String(targetValue));
        case 'not_contains': return !String(sourceValue).includes(String(targetValue));
        case 'is_empty': return sourceValue === undefined || sourceValue === null || sourceValue === '';
        case 'is_not_empty': return sourceValue !== undefined && sourceValue !== null && sourceValue !== '';
        default: return false;
    }
};

const evaluateConditionGroup = (group: ConditionGroup, formValues: any): boolean => {
    if (group.conditions.length === 0) return true; // No conditions means true
    if (group.conjunction === 'and') {
        return group.conditions.every(c => evaluateCondition(c, formValues));
    } else {
        return group.conditions.some(c => evaluateCondition(c, formValues));
    }
};

const evaluateFormula = (formula: string, formValues: any): string => {
    const populatedFormula = formula.replace(/\{([^}]+)\}/g, (_, fieldId) => {
        return formValues[fieldId] || 0;
    });

    try {
        // WARNING: Using eval is a security risk in real applications.
        // This is a simplified implementation for demonstration.
        // A proper implementation would use a safe formula parsing library.
        const result = new Function(`return ${populatedFormula}`)();
        return String(result);
    } catch (error) {
        return 'Error';
    }
};


const useFormLogic = (fields: FormFieldInstance[], formSettings: FormSettings) => {
    const [formValues, setFormValues] = useState<any>({});
    
    useEffect(() => {
        // Initialize with default values and URL params
        const initialValues: any = {};
        const urlParams = new URLSearchParams(window.location.search);

        const allFields: FormFieldInstance[] = [];
        const recurse = (items: FormFieldInstance[]) => {
            items.forEach(item => {
                allFields.push(item);
                if ('children' in item && Array.isArray(item.children)) recurse(item.children);
                if ('tabs' in item && Array.isArray(item.tabs)) item.tabs.forEach(t => recurse(t.children));
            });
        };
        recurse(fields);
        
        allFields.forEach(field => {
            if(field.defaultValue !== undefined) {
                initialValues[field.id] = field.defaultValue;
            }
        });

        formSettings.urlParameterMapping.forEach(mapping => {
            if (urlParams.has(mapping.paramName)) {
                initialValues[mapping.targetFieldId] = urlParams.get(mapping.paramName);
            }
        });
        
        setFormValues(initialValues);
    }, [fields, formSettings]);

    const handleValueChange = (fieldId: string, value: any) => {
        setFormValues(prev => ({ ...prev, [fieldId]: value }));
    };

    const fieldStates = useMemo(() => {
        const states: { [id: string]: { isVisible: boolean; isReadOnly: boolean; value: any } } = {};
        const allRules: LogicRule[] = [];
        
        const allFields: FormFieldInstance[] = [];
        const recurse = (items: FormFieldInstance[]) => {
            items.forEach(item => {
                allFields.push(item);
                if (item.logic) allRules.push(...item.logic);
                if ('children' in item && Array.isArray(item.children)) recurse(item.children);
                if ('tabs' in item && Array.isArray(item.tabs)) item.tabs.forEach(t => recurse(t.children));
            });
        };
        recurse(fields);

        // Initialize all fields
        allFields.forEach(field => {
            states[field.id] = {
                isVisible: true,
                isReadOnly: field.readOnly || false,
                value: formValues[field.id]
            };
        });

        // Apply rules
        allRules.forEach(rule => {
            if (evaluateConditionGroup(rule.conditions, formValues)) {
                rule.actions.forEach(action => {
                    if (states[action.targetFieldId]) {
                        switch (action.actionType) {
                            case 'show': states[action.targetFieldId].isVisible = true; break;
                            case 'hide': states[action.targetFieldId].isVisible = false; break;
                            case 'enable': states[action.targetFieldId].isReadOnly = false; break;
                            case 'disable': states[action.targetFieldId].isReadOnly = true; break;
                            case 'setValue': states[action.targetFieldId].value = action.value; break;
                        }
                    }
                });
            }
        });

        // Handle calculations
        allFields.forEach((field) => {
            if (field.type === FieldType.CalculatedField && field.formula) {
                let result = evaluateFormula(field.formula, formValues);
                if (field.formatting === 'currency_usd') {
                    result = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(result));
                }
                states[field.id].value = result;
            }
        });

        return states;
    }, [fields, formValues]);

    return { fieldStates, handleValueChange };
};

const FormPreview = () => {
    const { fields, formSettings } = useContext(FormBuilderContext);
    const [currentPage, setCurrentPage] = useState(0);

    const { fieldStates, handleValueChange } = useFormLogic(fields, formSettings);

    const { pages, progressTracker, stepLabels } = useMemo(() => {
        const pages: FormFieldInstance[][] = [];
        let currentPageFields: FormFieldInstance[] = [];
        const pageBreakLabels: string[] = [];
        
        fields.forEach(field => {
            if (field.type === FieldType.PageBreak) {
                pages.push(currentPageFields);
                currentPageFields = [];
                pageBreakLabels.push(field.label);
            } else {
                currentPageFields.push(field);
            }
        });
        pages.push(currentPageFields);
        
        const progressTracker = fields.find(f => f.type === FieldType.ProgressTrackerField);
        const stepLabels = ['Start', ...pageBreakLabels, 'Submit'];

        return { pages, progressTracker, stepLabels };
    }, [fields]);

    useEffect(() => {
        setCurrentPage(0);
    }, [pages.length]);

    if (!fields.length) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-24">
                 <p className="text-slate-500 mt-4">This form is empty.</p>
                 <p className="text-sm text-slate-600">Exit preview mode to add fields.</p>
            </div>
        );
    }
    
    const isMultiPage = pages.length > 1;

    const renderFieldWithLogic = (field: FormFieldInstance) => {
        const state = fieldStates[field.id];
        if (!state || !state.isVisible) return null;
        
        return (
             <FormFieldRenderer 
                key={field.id} 
                field={field} 
                isPreviewing={true} 
                isReadOnly={state.isReadOnly}
                value={state.value}
                onChange={handleValueChange}
            />
        );
    };

    return (
        <div className="max-w-3xl mx-auto bg-slate-900 rounded-xl p-8 shadow-2xl shadow-slate-950/50">
            {isMultiPage && progressTracker && (
                <RenderProgressTracker 
                    currentStep={currentPage}
                    totalSteps={pages.length}
                    stepLabels={stepLabels}
                />
            )}
             <div className="space-y-6">
                {pages[currentPage]?.map(renderFieldWithLogic)}
            </div>
            {isMultiPage && (
                 <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
                    <div>
                        {currentPage > 0 && <Button variant="secondary" onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>}
                    </div>
                     <div>
                        {currentPage < pages.length - 1 && <Button onClick={() => setCurrentPage(p => p + 1)}>Next</Button>}
                        {currentPage === pages.length - 1 && <Button>Submit</Button>}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Canvas = () => {
    const { fields, setSelectedFieldId, isPreviewing } = useContext(FormBuilderContext);
    const { setNodeRef, isOver } = useDroppable({
        id: 'root',
        data: { containerId: 'root', isContainer: true },
        disabled: isPreviewing,
    });

    const fieldIds = useMemo(() => fields.map(f => f.id), [fields]);

    if (isPreviewing) {
        return (
            <main className="flex-1 p-8 bg-slate-950 overflow-y-auto">
                <FormPreview />
            </main>
        );
    }

    return (
        <main 
            className="flex-1 p-8 bg-slate-950 overflow-y-auto" 
            onClick={() => setSelectedFieldId(null)}
        >
            <div
                ref={setNodeRef}
                className={`max-w-3xl mx-auto bg-slate-900 rounded-xl p-6 min-h-full transition-colors duration-150 ${
                    isOver ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-slate-950' : ''
                }`}
            >
                <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
                    {fields.length > 0 ? (
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <CanvasField key={field.id} field={field} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-700 rounded-lg py-24 hover:border-indigo-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 mb-4"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                            <h3 className="text-lg font-semibold text-slate-300">Your form is empty</h3>
                            <p className="text-slate-500 mt-2 text-center max-w-xs">Drop a control from the left panel to start building your form.</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </main>
    );
};