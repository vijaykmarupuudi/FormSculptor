import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FORM_ELEMENTS } from '../constants';
import { FormElement, FieldType } from '../types';

const DraggableControl = ({ formElement }: { formElement: FormElement }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `control-${formElement.label.replace(/\s/g, '')}`, // Use a unique key
        data: {
            type: formElement.type,
            subtype: formElement.subtype,
            isControl: true,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="flex items-center space-x-3 p-3 bg-slate-850 rounded-lg cursor-grab hover:bg-slate-800 hover:ring-2 hover:ring-indigo-500 transition-all"
        >
            <span className="text-indigo-400">{formElement.icon}</span>
            <span className="text-sm font-medium">{formElement.label}</span>
        </div>
    );
};

export const ControlLibrary = () => {
    const categories = ['Basic', 'Layout', 'Advanced', 'UX & Smart'];
    const elements = Object.values(FORM_ELEMENTS);

    return (
        <aside className="w-72 bg-slate-900 p-4 overflow-y-auto border-r border-slate-800">
            <h2 className="text-lg font-bold text-slate-200 mb-4 px-2">Controls</h2>
            <div className="space-y-6">
                {categories.map(category => (
                    <div key={category}>
                        <h3 className="text-xs font-semibold uppercase text-slate-500 mb-3 px-2">{category}</h3>
                        <div className="space-y-2">
                            {elements.filter(el => el.category === category).map(formElement => (
                                <DraggableControl key={formElement.label} formElement={formElement} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};