import React, { useState, useCallback, createContext } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Canvas } from './components/Canvas';
import { ControlLibrary } from './components/ControlLibrary';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { FormFieldInstance, FieldType, TextFieldSubtype, Tab, ABTestField, FormSettings, FormElement } from './types';
import { FORM_ELEMENTS } from './constants';
import { produce } from "immer";
import { FormFieldRenderer } from './components/FormFields';


const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;

type FormBuilderContextType = {
  fields: FormFieldInstance[];
  addField: (containerId: string, tabId: string | null, variant: 'A' | 'B' | null, index: number, fieldType: FieldType, subtype?: TextFieldSubtype) => void;
  removeField: (id: string) => void;
  updateField: (id:string, newProps: Partial<FormFieldInstance>) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  isPreviewing: boolean;
  setIsPreviewing: React.Dispatch<React.SetStateAction<boolean>>;
  formSettings: FormSettings;
  setFormSettings: React.Dispatch<React.SetStateAction<FormSettings>>;
};

export const FormBuilderContext = createContext<FormBuilderContextType>({
  fields: [],
  addField: () => {},
  removeField: () => {},
  updateField: () => {},
  selectedFieldId: null,
  setSelectedFieldId: () => {},
  isPreviewing: false,
  setIsPreviewing: () => {},
  formSettings: { urlParameterMapping: [] },
  setFormSettings: () => {},
});

export default function App() {
    const [fields, setFields] = useState<FormFieldInstance[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [formSettings, setFormSettings] = useState<FormSettings>({ urlParameterMapping: [] });
    const [activeDragItem, setActiveDragItem] = useState<FormFieldInstance | FormElement | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );
    
    const addField = useCallback((containerId: string, tabId: string | null, variant: 'A' | 'B' | null, index: number, fieldType: FieldType, subtype?: TextFieldSubtype) => {
        const id = crypto.randomUUID();
        let elementKey: string = fieldType;
        if (fieldType === FieldType.TextField && subtype) {
            const key = Object.keys(FORM_ELEMENTS).find(k => 
                FORM_ELEMENTS[k].type === FieldType.TextField && FORM_ELEMENTS[k].subtype === subtype);
            if (key) elementKey = key;
        }
        const newField = FORM_ELEMENTS[elementKey].construct(id);
        
        setFields(produce(draft => {
            const findAndInsert = (items: FormFieldInstance[]): boolean => {
                if (containerId === 'root') {
                    items.splice(index, 0, newField);
                    return true;
                }
                
                for(const item of items) {
                     if (item.id === containerId) {
                         if ((item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) && !tabId && !variant) {
                            item.children.splice(index, 0, newField);
                            return true;
                         }
                         if (item.type === FieldType.TabsField && tabId) {
                            const tab = item.tabs.find(t => t.id === tabId);
                            if (tab) {
                                tab.children.splice(index, 0, newField);
                                return true;
                            }
                         }
                         if (item.type === FieldType.ABTestField && variant) {
                            if (variant === 'A') item.variantA.splice(index, 0, newField);
                            else item.variantB.splice(index, 0, newField);
                            return true;
                         }
                     }
                     // Recurse
                     if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) {
                         if(findAndInsert(item.children)) return true;
                     }
                     if (item.type === FieldType.TabsField) {
                         for(const tab of item.tabs) {
                             if(findAndInsert(tab.children)) return true;
                         }
                     }
                     if (item.type === FieldType.ABTestField) {
                         if(findAndInsert(item.variantA)) return true;
                         if(findAndInsert(item.variantB)) return true;
                     }
                }
                return false;
            }
            findAndInsert(draft);
        }));
        setSelectedFieldId(id);
    }, []);

    const removeField = useCallback((id: string) => {
        setFields(produce(draft => {
            const remove = (items: FormFieldInstance[]): boolean => {
                for (let i = items.length - 1; i >= 0; i--) {
                    const item = items[i];
                    if (item.id === id) {
                        items.splice(i, 1);
                        return true;
                    }
                    if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) {
                        if (remove(item.children)) return true;
                    }
                    if (item.type === FieldType.TabsField) {
                         for(const tab of item.tabs) {
                            if (remove(tab.children)) return true;
                         }
                    }
                    if (item.type === FieldType.ABTestField) {
                        if (remove(item.variantA)) return true;
                        if (remove(item.variantB)) return true;
                    }
                }
                return false;
            };
            remove(draft);
        }));
        setSelectedFieldId(null);
    }, []);

    const updateField = useCallback((id: string, newProps: Partial<FormFieldInstance>) => {
        setFields(produce(draft => {
             const findAndUpdate = (items: FormFieldInstance[]): boolean => {
                for (const item of items) {
                    if (item.id === id) {
                        Object.assign(item, newProps);
                        return true;
                    }
                     if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) {
                        if (findAndUpdate(item.children)) return true;
                    }
                    if (item.type === FieldType.TabsField) {
                         for(const tab of item.tabs) {
                            if (findAndUpdate(tab.children)) return true;
                         }
                    }
                    if (item.type === FieldType.ABTestField) {
                        if (findAndUpdate(item.variantA)) return true;
                        if (findAndUpdate(item.variantB)) return true;
                    }
                }
                return false;
            };
            findAndUpdate(draft);
        }));
    }, []);

    const onDragStart = (event: DragStartEvent) => {
      const { active } = event;
      if (active.data.current?.isField) {
        const findField = (items: FormFieldInstance[]): FormFieldInstance | null => {
            for(const item of items) {
                if (item.id === active.id) return item;
                if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) {
                    const found = findField(item.children); if(found) return found;
                }
                if (item.type === FieldType.TabsField) {
                    for(const tab of item.tabs) { const found = findField(tab.children); if (found) return found; }
                }
                if (item.type === FieldType.ABTestField) {
                    const foundA = findField(item.variantA); if (foundA) return foundA;
                    const foundB = findField(item.variantB); if (foundB) return foundB;
                }
            }
            return null;
        }
        setActiveDragItem(findField(fields));
        setSelectedFieldId(active.id as string);
      } else if (active.data.current?.isControl) {
        const { type, subtype } = active.data.current;
        let elementKey = Object.keys(FORM_ELEMENTS).find(k => FORM_ELEMENTS[k].type === type && FORM_ELEMENTS[k].subtype === subtype) || type;
        setActiveDragItem(FORM_ELEMENTS[elementKey]);
      }
    }
    
    const onDragEnd = (event: DragEndEvent) => {
        setActiveDragItem(null);
        const { active, over } = event;
        if (!over) return;
        
        const isControl = active.data.current?.isControl;
        const isField = active.data.current?.isField;

        // Dropping a new control from sidebar
        if (isControl) {
            const { containerId = 'root', tabId = null, variant = null } = over.data.current ?? {};
            const fieldType = active.data.current?.type as FieldType;
            const subtype = active.data.current?.subtype as TextFieldSubtype | undefined;
            
            addField(containerId, tabId, variant, 999, fieldType, subtype); // Append to end
            return;
        }

        // Moving an existing field
        if (isField && active.id !== over.id) {
           setFields((currentFields) => {
                const oldIndex = -1;
                const newIndex = -1;
                
                let activeItem: FormFieldInstance | null = null;
                
                // 1. Find and remove the active item from its original position
                const fieldsWithoutActive = produce(currentFields, draft => {
                    const findAndRemove = (items: FormFieldInstance[]): boolean => {
                        for(let i = 0; i < items.length; i++) {
                            const item = items[i];
                            if (item.id === active.id) {
                                [activeItem] = items.splice(i, 1);
                                return true;
                            }
                            if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) {
                                if (findAndRemove(item.children)) return true;
                            }
                            if (item.type === FieldType.TabsField) {
                                for(const tab of item.tabs) if(findAndRemove(tab.children)) return true;
                            }
                            if (item.type === FieldType.ABTestField) {
                                if (findAndRemove(item.variantA)) return true;
                                if (findAndRemove(item.variantB)) return true;
                            }
                        }
                        return false;
                    }
                    findAndRemove(draft);
                });

                if (!activeItem) return currentFields; // Should not happen

                // 2. Insert the active item into its new position
                return produce(fieldsWithoutActive, draft => {
                    const { containerId = 'root', tabId = null, variant = null, isContainer } = over.data.current ?? {};
                    
                    if (isContainer) { // Dropping into an empty container
                        const findAndInsert = (items: FormFieldInstance[]): boolean => {
                            if (containerId === 'root') { items.push(activeItem!); return true; }

                            for(const item of items) {
                                if (item.id === containerId) {
                                    if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) { item.children.push(activeItem!); return true; }
                                    if (item.type === FieldType.TabsField && tabId) {
                                        const tab = item.tabs.find(t => t.id === tabId);
                                        if (tab) { tab.children.push(activeItem!); return true; }
                                    }
                                    if (item.type === FieldType.ABTestField && variant) {
                                        if (variant === 'A') item.variantA.push(activeItem!);
                                        else item.variantB.push(activeItem!);
                                        return true;
                                    }
                                }
                                // Recurse
                                if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) { if(findAndInsert(item.children)) return true; }
                                if (item.type === FieldType.TabsField) { for(const tab of item.tabs) if(findAndInsert(tab.children)) return true; }
                                if (item.type === FieldType.ABTestField) { if(findAndInsert(item.variantA)) return true; if(findAndInsert(item.variantB)) return true;}
                            }
                            return false;
                        }
                        findAndInsert(draft);

                    } else { // Dropping on top of another field (reordering)
                        const overId = over.id;
                         const findAndReorder = (items: FormFieldInstance[]): boolean => {
                            for(let i = 0; i < items.length; i++) {
                                const item = items[i];
                                if (item.id === overId) {
                                    items.splice(i, 0, activeItem!);
                                    return true;
                                }
                                // Recurse
                                if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) { if (findAndReorder(item.children)) return true; }
                                if (item.type === FieldType.TabsField) { for(const tab of item.tabs) if(findAndReorder(tab.children)) return true; }
                                if (item.type === FieldType.ABTestField) { if(findAndReorder(item.variantA)) return true; if(findAndReorder(item.variantB)) return true;}
                            }
                            return false;
                        }
                        findAndReorder(draft);
                    }
                });
            });
        }
    };
    
    const contextValue = {
        fields,
        addField,
        removeField,
        updateField,
        selectedFieldId,
        setSelectedFieldId,
        isPreviewing,
        setIsPreviewing,
        formSettings,
        setFormSettings,
    };

    return (
        <FormBuilderContext.Provider value={contextValue}>
            <DndContext 
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              collisionDetection={closestCenter}
            >
                <div className="flex flex-col h-screen w-full font-sans antialiased">
                     <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-slate-200 z-20">
                        <h1 className="text-xl font-bold">FormSculptor</h1>
                        <button 
                            onClick={() => setIsPreviewing(p => !p)} 
                            className="flex items-center space-x-2 px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500"
                        >
                            {isPreviewing ? <EditIcon /> : <EyeIcon />}
                            <span>{isPreviewing ? 'Exit Preview' : 'Live Preview'}</span>
                        </button>
                    </header>
                    <main className="flex flex-1 overflow-hidden">
                        {!isPreviewing && <ControlLibrary />}
                        <Canvas />
                        {!isPreviewing && <ConfigurationPanel />}
                    </main>
                </div>
                <DragOverlay>
                    {activeDragItem && (
                        <div className="bg-slate-800 p-4 rounded-md shadow-2xl opacity-80">
                            {'id' in activeDragItem ? (
                                <FormFieldRenderer field={activeDragItem as FormFieldInstance} />
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <span className="text-indigo-400">{activeDragItem.icon}</span>
                                    <span className="text-sm font-medium">{activeDragItem.label}</span>
                                </div>
                            )}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </FormBuilderContext.Provider>
    );
}