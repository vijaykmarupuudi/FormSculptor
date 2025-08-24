import React, { useContext, useState, useMemo } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FormFieldInstance, FieldType, GroupField, TabsField, RepeaterField, ABTestField } from '../types';
import { FormBuilderContext } from '../App';
import { FormFieldRenderer } from './FormFields';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-slate-500">
        <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);
const GripVerticalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9"cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
    </svg>
);

// Container for Group Fields in the Canvas
const CanvasGroupField = ({ field }: { field: GroupField }) => {
    const { setSelectedFieldId, selectedFieldId } = useContext(FormBuilderContext);
    const { setNodeRef, isOver } = useDroppable({
        id: `container-${field.id}`,
        data: { containerId: field.id, isContainer: true },
    });
    const childIds = useMemo(() => field.children.map(c => c.id), [field.children]);
    const isSelected = selectedFieldId === field.id;

    return (
        <div
            onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
            className={`relative p-4 bg-slate-900/50 rounded-md border-2 transition-colors ${isSelected ? 'border-indigo-500' : 'border-slate-800'}`}
            style={field.styles}
        >
             <div className="absolute top-2 left-2 text-xs text-slate-500 uppercase">{field.label}</div>
            <div
                ref={setNodeRef}
                className={`min-h-[100px] p-4 mt-4 rounded-md transition-all duration-150 ${ isOver ? 'bg-indigo-950/50 ring-2 ring-indigo-500 ring-dashed' : 'bg-slate-850/50' }`}
            >
                <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
                    {field.children.length > 0 ? (
                        <div className="space-y-4">
                            {field.children.map((child, index) => (
                                <CanvasField key={child.id} field={child} index={index} />
                            ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center text-center text-slate-500 py-8">
                            <PlusIcon />
                            <p className="mt-2 text-sm">Drop fields here</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

// Container for Tabs Fields in the Canvas
const CanvasTabsField = ({ field }: { field: TabsField }) => {
    const { setSelectedFieldId, selectedFieldId } = useContext(FormBuilderContext);
    const [activeTab, setActiveTab] = useState(field.tabs[0]?.id);
    const isSelected = selectedFieldId === field.id;
    
    const activeTabData = field.tabs.find(t => t.id === activeTab);
    const childIds = useMemo(() => activeTabData?.children.map(c => c.id) ?? [], [activeTabData]);

    const { setNodeRef, isOver } = useDroppable({
        id: `container-tab-${activeTab}`,
        data: { containerId: field.id, tabId: activeTab, isContainer: true },
    });

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
            className={`relative p-4 bg-slate-900/50 rounded-md border-2 transition-colors ${isSelected ? 'border-indigo-500' : 'border-slate-800'}`}
            style={field.styles}
        >
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {field.tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                tab.id === activeTab
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div
                ref={setNodeRef}
                className={`min-h-[100px] p-4 mt-4 rounded-md transition-all duration-150 ${ isOver ? 'bg-indigo-950/50 ring-2 ring-indigo-500 ring-dashed' : 'bg-slate-850/50' }`}
            >
                <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
                    {activeTabData && activeTabData.children.length > 0 ? (
                         <div className="space-y-4">
                            {activeTabData.children.map((child, index) => (
                                <CanvasField key={child.id} field={child} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-500 py-8">
                            <PlusIcon />
                            <p className="mt-2 text-sm">Drop fields here</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

// Container for Repeater Fields
const CanvasRepeaterField = ({ field }: { field: RepeaterField }) => {
    const { setSelectedFieldId, selectedFieldId } = useContext(FormBuilderContext);
    const { setNodeRef, isOver } = useDroppable({
        id: `container-${field.id}`,
        data: { containerId: field.id, isContainer: true },
    });
    const childIds = useMemo(() => field.children.map(c => c.id), [field.children]);
    const isSelected = selectedFieldId === field.id;

    return (
        <div
            onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
            className={`relative p-4 bg-slate-900/50 rounded-md border-2 transition-colors ${isSelected ? 'border-indigo-500' : 'border-dashed border-slate-700'}`}
            style={field.styles}
        >
             <div className="absolute top-2 left-2 text-xs text-slate-500 uppercase">{field.label}</div>
            <div
                ref={setNodeRef}
                className={`min-h-[100px] p-4 mt-4 rounded-md transition-all duration-150 ${ isOver ? 'bg-indigo-950/50 ring-2 ring-indigo-500 ring-dashed' : 'bg-slate-850/50' }`}
            >
                 <p className="text-center text-xs text-slate-500 mb-4 italic">Define the template for repeatable items below</p>
                <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
                    {field.children.length > 0 ? (
                        <div className="space-y-4">
                            {field.children.map((child, index) => (
                                <CanvasField key={child.id} field={child} index={index} />
                            ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center text-center text-slate-500 py-8">
                            <PlusIcon />
                            <p className="mt-2 text-sm">Drop fields here</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

// Container for A/B Test Fields
const CanvasABTestField = ({ field }: { field: ABTestField }) => {
    const { setSelectedFieldId, selectedFieldId } = useContext(FormBuilderContext);
    const [activeVariant, setActiveVariant] = useState<'A' | 'B'>('A');
    const isSelected = selectedFieldId === field.id;
    
    const activeChildren = activeVariant === 'A' ? field.variantA : field.variantB;
    const childIds = useMemo(() => activeChildren.map(c => c.id), [activeChildren]);

    const { setNodeRef, isOver } = useDroppable({
        id: `container-ab-${field.id}-${activeVariant}`,
        data: { containerId: field.id, variant: activeVariant, isContainer: true },
    });

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
            className={`relative p-4 bg-slate-900/50 rounded-md border-2 transition-colors ${isSelected ? 'border-indigo-500' : 'border-purple-600 border-dashed'}`}
            style={field.styles}
        >
             <div className="absolute top-2 left-2 text-xs text-purple-400 uppercase">{field.label}</div>
            <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-md shadow-sm bg-slate-800 p-1">
                    <button onClick={() => setActiveVariant('A')} className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${activeVariant === 'A' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>Variant A</button>
                    <button onClick={() => setActiveVariant('B')} className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${activeVariant === 'B' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>Variant B</button>
                </div>
            </div>
            <div
                ref={setNodeRef}
                className={`min-h-[100px] p-4 rounded-md transition-all duration-150 ${ isOver ? 'bg-indigo-950/50 ring-2 ring-indigo-500 ring-dashed' : 'bg-slate-850/50' }`}
            >
                <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
                    {activeChildren.length > 0 ? (
                         <div className="space-y-4">
                            {activeChildren.map((child, index) => (
                                <CanvasField key={child.id} field={child} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-500 py-8">
                            <PlusIcon />
                            <p className="mt-2 text-sm">Drop fields for Variant {activeVariant} here</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};


// Main dispatcher component for all canvas fields
export const CanvasField = ({ field, index }: { field: FormFieldInstance; index: number }) => {
    const { removeField, setSelectedFieldId, selectedFieldId } = useContext(FormBuilderContext);
    
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: field.id,
        data: {
            fieldId: field.id,
            isField: true
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const isSelected = selectedFieldId === field.id;

    // Dispatch to container components if needed
    if (field.type === FieldType.GroupField) {
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners}><CanvasGroupField field={field} /></div>;
    }
    if (field.type === FieldType.TabsField) {
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners}><CanvasTabsField field={field} /></div>;
    }
    if (field.type === FieldType.RepeaterField) {
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners}><CanvasRepeaterField field={field} /></div>;
    }
    if (field.type === FieldType.ABTestField) {
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners}><CanvasABTestField field={field} /></div>;
    }

    // Default renderer for non-container fields
    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
            className={`relative group bg-slate-850 rounded-md cursor-pointer border-2 transition-colors ${
                isSelected ? 'border-indigo-500 shadow-lg' : 'border-transparent hover:border-slate-700'
            }`}
        >
            <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 text-slate-500 font-mono text-lg select-none w-8 text-right">
                {index + 1}.
            </div>
            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
                 <button 
                    {...attributes} 
                    {...listeners}
                    className="p-1 text-slate-400 hover:text-white cursor-grab active:cursor-grabbing"
                    aria-label="Drag to reorder"
                >
                    <GripVerticalIcon />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                    className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                    aria-label="Delete field"
                >
                    <TrashIcon />
                </button>
            </div>
            
            <div className="pointer-events-none p-4" style={field.styles}>
                <FormFieldRenderer field={field} />
            </div>
        </div>
    );
};