import React, { useState, useCallback, createContext, useEffect } from 'react';
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
import { Canvas } from './components/Canvas';
import { ControlLibrary } from './components/ControlLibrary';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { FormFieldInstance, FieldType, TextFieldSubtype, FormSettings, FormElement, SavedForm } from './types';
import { FORM_ELEMENTS } from './constants';
import { produce } from "immer";
import { FormFieldRenderer } from './components/FormFields';
import { HistoryView } from './components/HistoryView';
import { Button } from './components/ui';


const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>;
const PlusSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;


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
  setFormSettings: (settings: FormSettings) => void;
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

const createEmptyForm = (): SavedForm => ({
    id: crypto.randomUUID(),
    name: 'Untitled Form',
    fields: [],
    formSettings: { urlParameterMapping: [] },
    savedAt: new Date().toISOString(),
});

export default function App() {
    const [allForms, setAllForms] = useState<SavedForm[]>([]);
    const [currentForm, setCurrentForm] = useState<SavedForm>(createEmptyForm());
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [activeDragItem, setActiveDragItem] = useState<FormFieldInstance | FormElement | null>(null);
    const [view, setView] = useState<'builder' | 'history'>('builder');

    useEffect(() => {
        const savedForms = localStorage.getItem('formSculptor_forms');
        if (savedForms) {
            setAllForms(JSON.parse(savedForms));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('formSculptor_forms', JSON.stringify(allForms));
    }, [allForms]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );
    
    const setFields = (updater: (draft: FormFieldInstance[]) => void) => {
        setCurrentForm(produce(draft => {
            updater(draft.fields);
        }));
    };
    
    const setFormSettings = (newSettings: FormSettings) => {
        setCurrentForm(produce(draft => {
            draft.formSettings = newSettings;
        }));
    };

    const addField = useCallback((containerId: string, tabId: string | null, variant: 'A' | 'B' | null, index: number, fieldType: FieldType, subtype?: TextFieldSubtype) => {
        const id = crypto.randomUUID();
        let elementKey: string = fieldType;
        if (fieldType === FieldType.TextField && subtype) {
            const key = Object.keys(FORM_ELEMENTS).find(k => 
                FORM_ELEMENTS[k].type === FieldType.TextField && FORM_ELEMENTS[k].subtype === subtype);
            if (key) elementKey = key;
        }
        const newField = FORM_ELEMENTS[elementKey].construct(id);
        
        setFields(draft => {
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
        });
        setSelectedFieldId(id);
    }, []);

    const removeField = useCallback((id: string) => {
        setFields(draft => {
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
        });
        setSelectedFieldId(null);
    }, []);

    const updateField = useCallback((id: string, newProps: Partial<FormFieldInstance>) => {
        setFields(draft => {
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
        });
    }, []);

    const handleSave = () => {
        const formName = currentForm.name === 'Untitled Form' 
            ? prompt('Enter a name for your form:', currentForm.name) 
            : currentForm.name;
            
        if (!formName) return;

        const formToSave: SavedForm = {
            ...currentForm,
            name: formName,
            savedAt: new Date().toISOString(),
        };
        
        setAllForms(produce(draft => {
            const existingIndex = draft.findIndex(f => f.id === formToSave.id);
            if (existingIndex !== -1) {
                draft[existingIndex] = formToSave;
            } else {
                draft.push(formToSave);
            }
        }));
        setCurrentForm(formToSave); // Ensure current form has updated name and savedAt
        alert('Form saved successfully!');
    };

    const handleNew = () => {
        setCurrentForm(createEmptyForm());
        setSelectedFieldId(null);
        setView('builder');
    };

    const handleLoad = (formId: string) => {
        const formToLoad = allForms.find(f => f.id === formId);
        if (formToLoad) {
            setCurrentForm(formToLoad);
            setSelectedFieldId(null);
            setView('builder');
        }
    };

    const handleDelete = (formId: string) => {
        if (confirm('Are you sure you want to delete this form?')) {
            setAllForms(prev => prev.filter(f => f.id !== formId));
        }
    };
    
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
        setActiveDragItem(findField(currentForm.fields));
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

        if (isControl) {
            const { containerId = 'root', tabId = null, variant = null } = over.data.current ?? {};
            const fieldType = active.data.current?.type as FieldType;
            const subtype = active.data.current?.subtype as TextFieldSubtype | undefined;
            
            addField(containerId, tabId, variant, 999, fieldType, subtype);
            return;
        }

        if (isField && active.id !== over.id) {
           setCurrentForm(produce(formDraft => {
                let activeItem: FormFieldInstance | null = null;
                
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
                findAndRemove(formDraft.fields);

                if (!activeItem) return;

                const { containerId = 'root', tabId = null, variant = null, isContainer } = over.data.current ?? {};
                
                if (isContainer) {
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
                            if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) { if(findAndInsert(item.children)) return true; }
                            if (item.type === FieldType.TabsField) { for(const tab of item.tabs) if(findAndInsert(tab.children)) return true; }
                            if (item.type === FieldType.ABTestField) { if(findAndInsert(item.variantA)) return true; if(findAndInsert(item.variantB)) return true;}
                        }
                        return false;
                    }
                    findAndInsert(formDraft.fields);
                } else {
                    const overId = over.id;
                     const findAndReorder = (items: FormFieldInstance[]): boolean => {
                        for(let i = 0; i < items.length; i++) {
                            const item = items[i];
                            if (item.id === overId) {
                                items.splice(i, 0, activeItem!);
                                return true;
                            }
                            if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) { if (findAndReorder(item.children)) return true; }
                            if (item.type === FieldType.TabsField) { for(const tab of item.tabs) if(findAndReorder(tab.children)) return true; }
                            if (item.type === FieldType.ABTestField) { if(findAndReorder(item.variantA)) return true; if(findAndReorder(item.variantB)) return true;}
                        }
                        return false;
                    }
                    findAndReorder(formDraft.fields);
                }
            }));
        }
    };
    
    const contextValue = {
        fields: currentForm.fields,
        addField,
        removeField,
        updateField,
        selectedFieldId,
        setSelectedFieldId,
        isPreviewing,
        setIsPreviewing,
        formSettings: currentForm.formSettings,
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
                     <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-slate-200 z-20 shrink-0">
                        <div className="flex items-center space-x-6">
                            <h1 className="text-xl font-bold">FormSculptor</h1>
                             <div className="flex items-center space-x-2">
                                <Button variant="secondary" onClick={() => setView('history')}><FolderIcon /><span>My Forms</span></Button>
                                <Button variant="secondary" onClick={handleNew}><PlusSquareIcon /><span>New Form</span></Button>
                             </div>
                        </div>
                        <div className="flex items-center space-x-2">
                             <span className="text-sm text-slate-400 italic truncate max-w-xs" title={currentForm.name}>{currentForm.name}</span>
                             <Button onClick={handleSave}><SaveIcon /><span>Save</span></Button>
                            <button 
                                onClick={() => setIsPreviewing(p => !p)} 
                                className="flex items-center space-x-2 px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500"
                            >
                                {isPreviewing ? <EditIcon /> : <EyeIcon />}
                                <span>{isPreviewing ? 'Exit Preview' : 'Live Preview'}</span>
                            </button>
                        </div>
                    </header>
                    <main className="flex flex-1 overflow-hidden">
                        {view === 'builder' ? (
                            <>
                                {!isPreviewing && <ControlLibrary />}
                                <Canvas />
                                {!isPreviewing && <ConfigurationPanel />}
                            </>
                        ) : (
                            <HistoryView forms={allForms} onLoad={handleLoad} onDelete={handleDelete} />
                        )}
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