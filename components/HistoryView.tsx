import React from 'react';
import { SavedForm } from '../types';
import { Button } from './ui';

const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

type HistoryViewProps = {
    forms: SavedForm[];
    onLoad: (formId: string) => void;
    onDelete: (formId: string) => void;
};

export const HistoryView = ({ forms, onLoad, onDelete }: HistoryViewProps) => {

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <div className="flex-1 p-8 bg-slate-950 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-100 mb-6">My Saved Forms</h2>
                {forms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map(form => (
                            <div key={form.id} className="bg-slate-900 rounded-lg shadow-lg p-5 flex flex-col justify-between border border-slate-800 hover:border-indigo-600 transition-colors">
                                <div>
                                    <div className="flex items-start space-x-3 mb-3">
                                        <div className="text-indigo-500 mt-1">
                                            <FileIcon />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-200 break-all">{form.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 flex items-center space-x-2">
                                        <ClockIcon />
                                        <span>Last saved: {formatDate(form.savedAt)}</span>
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center justify-end space-x-2 border-t border-slate-800 pt-4">
                                     <Button onClick={() => onDelete(form.id)} variant="danger" className="text-xs">Delete</Button>
                                    <Button onClick={() => onLoad(form.id)} variant="primary" className="text-xs">Load</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-lg">
                        <h3 className="text-xl font-semibold text-slate-400">No Saved Forms</h3>
                        <p className="text-slate-500 mt-2">Click "New Form" and "Save" in the builder to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
