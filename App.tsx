
import React, { useState, useCallback, createContext, useEffect, useMemo } from 'react';
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
import { produce } from "immer";

import { Canvas } from './components/Canvas';
import { ControlLibrary } from './components/ControlLibrary';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { FormFieldInstance, FieldType, TextFieldSubtype, FormSettings, FormElement, SavedForm, User, Organization, Role, Permission, DbState } from './types';
import { FORM_ELEMENTS } from './constants';
import { FormFieldRenderer } from './components/FormFields';
import { HistoryView } from './components/HistoryView';
import { Button } from './components/ui';
import { LandingPage } from './components/LandingPage';
import { SystemAdminView } from './components/SystemAdminView';

// --- ICONS ---
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>;
const PlusSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;


// --- CONTEXT ---
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
  fields: [], addField: () => {}, removeField: () => {}, updateField: () => {}, selectedFieldId: null, setSelectedFieldId: () => {}, isPreviewing: false, setIsPreviewing: () => {},
  formSettings: { name: 'Untitled', urlParameterMapping: [] }, setFormSettings: () => {},
});

// --- MOCK DATABASE & DEFAULTS ---
const createInitialData = (): DbState => {
    // SYSTEM ADMIN ROLE
    const systemAdminRoleId = 'role_system_admin';
    const systemAdminRole: Role = {
        id: systemAdminRoleId,
        name: 'System Admin',
        description: 'Has all permissions across the entire system.',
        permissions: Object.values(Permission),
    };

    // ORGANIZATION ADMIN ROLE
    const orgAdminRoleId = 'role_org_admin';
    const orgAdminRole: Role = {
        id: orgAdminRoleId,
        name: 'Organization Admin',
        description: 'Manages users and forms within their organization.',
        permissions: [Permission.USER_INVITE, Permission.USER_READ, Permission.USER_UPDATE, Permission.USER_DELETE, Permission.FORM_CREATE, Permission.FORM_READ, Permission.FORM_UPDATE, Permission.FORM_DELETE, Permission.FORM_SHARE],
    };
    
    // FORM CREATOR ROLE
    const formCreatorRoleId = 'role_form_creator';
    const formCreatorRole: Role = {
        id: formCreatorRoleId,
        name: 'Form Creator',
        description: 'Can create and manage their own forms.',
        permissions: [Permission.FORM_CREATE, Permission.FORM_READ, Permission.FORM_UPDATE, Permission.FORM_DELETE],
    };

    // SYSTEM ADMIN USER
    const systemAdminOrgId = 'org_system';
    const systemAdminOrg: Organization = { id: systemAdminOrgId, name: 'System Administration' };
    const systemAdminUser: User = {
        id: 'user_system_admin',
        email: 'admin@system.com',
        passwordHash: 'admin123',
        organizationId: systemAdminOrgId,
        roleId: systemAdminRoleId,
    };
    
    // DEFAULT USER
    const defaultOrgId = 'org_default';
    const defaultOrg: Organization = { id: defaultOrgId, name: 'Default Inc.' };
    const defaultUser: User = {
        id: 'user_default',
        email: 'user@example.com',
        passwordHash: 'user123',
        organizationId: defaultOrgId,
        roleId: orgAdminRoleId,
    }

    return {
        users: [systemAdminUser, defaultUser],
        organizations: [systemAdminOrg, defaultOrg],
        roles: [systemAdminRole, orgAdminRole, formCreatorRole],
        forms: [] as SavedForm[],
    };
};

const createEmptyForm = (organizationId: string): SavedForm => ({
    id: crypto.randomUUID(),
    organizationId,
    fields: [],
    formSettings: { name: 'Untitled Form', urlParameterMapping: [] },
    savedAt: new Date().toISOString(),
});

// --- MAIN APP COMPONENT ---
export default function App() {
    // --- STATE MANAGEMENT ---
    const [db, setDb] = useState<DbState>(() => {
        const savedDb = localStorage.getItem('formSculptor_db');
        return savedDb ? JSON.parse(savedDb) : createInitialData();
    });
    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentForm, setCurrentForm] = useState<SavedForm | null>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [activeDragItem, setActiveDragItem] = useState<FormFieldInstance | FormElement | null>(null);
    const [view, setView] = useState<'landing' | 'builder' | 'history' | 'adminDashboard'>('landing');

    // Persist DB to local storage
    useEffect(() => {
        localStorage.setItem('formSculptor_db', JSON.stringify(db));
    }, [db]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

    // --- AUTHENTICATION ---
    const handleLogin = (email: string, pass: string): boolean => {
        const user = db.users.find(u => u.email === email && u.passwordHash === pass);
        if (user) {
            setCurrentUser(user);
            setView('history');
            return true;
        }
        return false;
    };
    
    const handleSignUp = (email: string, pass: string): boolean => {
        if(db.users.some(u => u.email === email)) {
            alert('User with this email already exists.');
            return false;
        }
        const newOrg: Organization = { id: crypto.randomUUID(), name: `${email.split('@')[0]}'s Organization` };
        const orgAdminRole = db.roles.find(r => r.name === 'Organization Admin');
        if (!orgAdminRole) {
            alert('Critical error: Organization Admin role not found.');
            return false;
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            passwordHash: pass,
            organizationId: newOrg.id,
            roleId: orgAdminRole.id,
        };
        setDb(produce(draft => {
            draft.organizations.push(newOrg);
            draft.users.push(newUser);
        }));
        setCurrentUser(newUser);
        setView('history');
        return true;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentForm(null);
        setView('landing');
    };

    // --- FORM MANAGEMENT ---
    const setFields = useCallback((updater: (draft: FormFieldInstance[]) => void) => {
        if (!currentForm) return;
        const newForm = produce(currentForm, draft => {
            updater(draft.fields);
        });
        setCurrentForm(newForm);
    }, [currentForm]);

    const setFormSettings = useCallback((newSettings: FormSettings) => {
        if (!currentForm) return;
        setCurrentForm(produce(currentForm, draft => {
            draft.formSettings = newSettings;
        }));
    }, [currentForm]);

    const handleSave = () => {
        if (!currentForm) return;
        const formToSave: SavedForm = { ...currentForm, savedAt: new Date().toISOString() };
        setDb(produce(draft => {
            const existingIndex = draft.forms.findIndex(f => f.id === formToSave.id);
            if (existingIndex !== -1) {
                draft.forms[existingIndex] = formToSave;
            } else {
                draft.forms.push(formToSave);
            }
        }));
        alert('Form saved successfully!');
    };

    const handleNew = () => {
        if (!currentUser) return;
        setCurrentForm(createEmptyForm(currentUser.organizationId));
        setSelectedFieldId(null);
        setView('builder');
    };

    const handleLoad = (formId: string) => {
        const formToLoad = db.forms.find(f => f.id === formId);
        if (formToLoad) {
            setCurrentForm(formToLoad);
            setSelectedFieldId(null);
            setView('builder');
        }
    };

    const handleDelete = (formId: string) => {
        if (confirm('Are you sure you want to delete this form?')) {
            setDb(produce(draft => {
                draft.forms = draft.forms.filter(f => f.id !== formId);
            }));
        }
    };

    // --- FIELD MANIPULATION ---
    const addField = useCallback((containerId: string, tabId: string | null, variant: 'A' | 'B' | null, index: number, fieldType: FieldType, subtype?: TextFieldSubtype) => {
        const id = crypto.randomUUID();
        let elementKey = Object.keys(FORM_ELEMENTS).find(k => FORM_ELEMENTS[k].type === fieldType && FORM_ELEMENTS[k].subtype === subtype) || fieldType;
        const newField = FORM_ELEMENTS[elementKey].construct(id);
        
        setFields(draft => {
            const findAndInsert = (items: FormFieldInstance[]): boolean => {
                if (containerId === 'root') { items.splice(index, 0, newField); return true; }
                for(const item of items) {
                     if (item.id === containerId) {
                         if ((item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) && !tabId && !variant) { item.children.splice(index, 0, newField); return true; }
                         if (item.type === FieldType.TabsField && tabId) { const tab = item.tabs.find(t => t.id === tabId); if (tab) { tab.children.splice(index, 0, newField); return true; } }
                         if (item.type === FieldType.ABTestField && variant) { if (variant === 'A') item.variantA.splice(index, 0, newField); else item.variantB.splice(index, 0, newField); return true; }
                     }
                     if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) if(findAndInsert(item.children)) return true;
                     if (item.type === FieldType.TabsField) for(const tab of item.tabs) if(findAndInsert(tab.children)) return true;
                     if (item.type === FieldType.ABTestField) { if(findAndInsert(item.variantA)) return true; if(findAndInsert(item.variantB)) return true; }
                }
                return false;
            }
            findAndInsert(draft);
        });
        setSelectedFieldId(id);
    }, [setFields]);

    const removeField = useCallback((id: string) => {
        setFields(draft => {
            const remove = (items: FormFieldInstance[]): boolean => {
                for (let i = items.length - 1; i >= 0; i--) {
                    const item = items[i];
                    if (item.id === id) { items.splice(i, 1); return true; }
                    if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) if (remove(item.children)) return true;
                    if (item.type === FieldType.TabsField) for(const tab of item.tabs) if (remove(tab.children)) return true;
                    if (item.type === FieldType.ABTestField) { if (remove(item.variantA)) return true; if (remove(item.variantB)) return true; }
                }
                return false;
            };
            remove(draft);
        });
        setSelectedFieldId(null);
    }, [setFields]);

    const updateField = useCallback((id: string, newProps: Partial<FormFieldInstance>) => {
        setFields(draft => {
             const findAndUpdate = (items: FormFieldInstance[]): boolean => {
                for (const item of items) {
                    if (item.id === id) { Object.assign(item, newProps); return true; }
                    if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) if (findAndUpdate(item.children)) return true;
                    if (item.type === FieldType.TabsField) for(const tab of item.tabs) if (findAndUpdate(tab.children)) return true;
                    if (item.type === FieldType.ABTestField) { if (findAndUpdate(item.variantA)) return true; if (findAndUpdate(item.variantB)) return true; }
                }
                return false;
            };
            findAndUpdate(draft);
        });
    }, [setFields]);
    
    // --- DRAG & DROP HANDLERS ---
    const onDragStart = (event: DragStartEvent) => {
      const { active } = event;
      if (active.data.current?.isField) {
        const findField = (items: FormFieldInstance[]): FormFieldInstance | null => {
            for(const item of items) {
                if (item.id === active.id) return item;
                if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) {
                    const found = findField(item.children);
                    if (found) return found;
                }
                if (item.type === FieldType.TabsField) {
                    for (const tab of item.tabs) {
                        const found = findField(tab.children);
                        if (found) return found;
                    }
                }
                if (item.type === FieldType.ABTestField) {
                    const foundA = findField(item.variantA);
                    if (foundA) return foundA;
                    const foundB = findField(item.variantB);
                    if (foundB) return foundB;
                }
            }
            return null;
        }
        setActiveDragItem(findField(currentForm?.fields || []));
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
        if (!over || !currentForm) return;
        
        const isControl = active.data.current?.isControl;
        const isField = active.data.current?.isField;

        if (isControl) {
            const { containerId = 'root', tabId = null, variant = null } = over.data.current ?? {};
            addField(containerId, tabId, variant, 999, active.data.current?.type, active.data.current?.subtype);
            return;
        }

        if (isField && active.id !== over.id) {
           setCurrentForm(produce(currentForm, draft => {
                let activeItem: FormFieldInstance | null = null;
                const findAndRemove = (items: FormFieldInstance[]): boolean => {
                    for(let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.id === active.id) { [activeItem] = items.splice(i, 1); return true; }
                        if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) if (findAndRemove(item.children)) return true;
                        if (item.type === FieldType.TabsField) for(const tab of item.tabs) if(findAndRemove(tab.children)) return true;
                        if (item.type === FieldType.ABTestField) { if (findAndRemove(item.variantA)) return true; if (findAndRemove(item.variantB)) return true; }
                    }
                    return false;
                }
                findAndRemove(draft.fields);

                if (!activeItem) return;

                const { containerId = 'root', tabId = null, variant = null, isContainer } = over.data.current ?? {};
                
                const findAndInsertOrReorder = (items: FormFieldInstance[]): boolean => {
                    if (isContainer && containerId === 'root') { items.push(activeItem!); return true; }
                    for(let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (isContainer && item.id === containerId) {
                            if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) { (item as any).children.push(activeItem!); return true; }
                            if (item.type === FieldType.TabsField && tabId) { const tab = (item as any).tabs.find(t => t.id === tabId); if (tab) { tab.children.push(activeItem!); return true; } }
                            if (item.type === FieldType.ABTestField && variant) { if (variant === 'A') (item as any).variantA.push(activeItem!); else (item as any).variantB.push(activeItem!); return true; }
                        }
                        if (!isContainer && item.id === over.id) { items.splice(i, 0, activeItem!); return true; }
                        if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) if (findAndInsertOrReorder(item.children)) return true;
                        if (item.type === FieldType.TabsField) for(const tab of item.tabs) if(findAndInsertOrReorder(tab.children)) return true;
                        if (item.type === FieldType.ABTestField) { if(findAndInsertOrReorder(item.variantA)) return true; if(findAndInsertOrReorder(item.variantB)) return true; }
                    }
                    return false;
                }
                findAndInsertOrReorder(draft.fields);
            }));
        }
    };
    
    // --- RENDER LOGIC ---
    if (view === 'landing') {
        return <LandingPage onLogin={handleLogin} onSignUp={handleSignUp} />;
    }

    if (!currentUser) {
        return <LandingPage onLogin={handleLogin} onSignUp={handleSignUp} />;
    }
    
    const contextValue = {
        fields: currentForm?.fields || [],
        addField, removeField, updateField, selectedFieldId, setSelectedFieldId, isPreviewing, setIsPreviewing,
        formSettings: currentForm?.formSettings || { name: '', urlParameterMapping: [] }, setFormSettings,
    };
    
    const isSystemAdmin = currentUser.email === 'admin@system.com';
    const userOrgForms = db.forms.filter(f => f.organizationId === currentUser.organizationId);

    return (
        <FormBuilderContext.Provider value={contextValue}>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
                <div className="flex flex-col h-screen w-full font-sans antialiased">
                     <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-slate-200 z-20 shrink-0">
                        <div className="flex items-center space-x-6">
                            <h1 className="text-xl font-bold">FormSculptor</h1>
                            {(view === 'builder' || view === 'history') && (
                                <div className="flex items-center space-x-2">
                                    <Button variant="secondary" onClick={() => setView('history')}><FolderIcon /><span>My Forms</span></Button>
                                    <Button variant="secondary" onClick={handleNew}><PlusSquareIcon /><span>New Form</span></Button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            {view === 'builder' && currentForm && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-slate-400 italic truncate max-w-xs" title={currentForm.formSettings.name}>{currentForm.formSettings.name}</span>
                                    <Button onClick={handleSave}><SaveIcon /><span>Save</span></Button>
                                    <button onClick={() => setIsPreviewing(p => !p)} className="flex items-center space-x-2 px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500">
                                        {isPreviewing ? <EditIcon /> : <EyeIcon />}
                                        <span>{isPreviewing ? 'Exit Preview' : 'Live Preview'}</span>
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center space-x-2 border-l border-slate-700 pl-4">
                                {isSystemAdmin && view !== 'adminDashboard' && (
                                    <Button variant="secondary" onClick={() => setView('adminDashboard')}><ShieldIcon /><span>Admin Dashboard</span></Button>
                                )}
                                <span className="text-sm text-slate-400">{currentUser.email}</span>
                                <Button onClick={handleLogout} variant="secondary"><LogOutIcon /></Button>
                            </div>
                        </div>
                    </header>
                    <main className="flex flex-1 overflow-hidden">
                        {view === 'adminDashboard' ? (
                            <SystemAdminView db={db} setDb={setDb} onExit={() => setView('history')} />
                        ) : view === 'builder' && currentForm ? (
                            <>
                                {!isPreviewing && <ControlLibrary />}
                                <Canvas />
                                {!isPreviewing && <ConfigurationPanel />}
                            </>
                        ) : (
                            <HistoryView forms={userOrgForms} onLoad={handleLoad} onDelete={handleDelete} onNew={handleNew} />
                        )}
                    </main>
                </div>
                <DragOverlay>
                    {activeDragItem && (
                        <div className="bg-slate-800 p-4 rounded-md shadow-2xl opacity-80">
                            {'id' in activeDragItem ? ( <FormFieldRenderer field={activeDragItem as FormFieldInstance} /> ) : (
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
