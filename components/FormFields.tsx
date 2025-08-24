
import React, { useState } from 'react';
import { FormField, FieldType, TextField, TextareaField, SelectField, CheckboxField, RadioGroupField, DatePickerField, FileUploadField, SignatureField, RatingField, SliderField, SectionBreak, TimeField, DateTimeField, GroupField, TabsField, PageBreak, ImageField, HtmlField, MatrixField, LookupField, GeolocationField, PaymentField, CalculatedField, RepeaterField, ABTestField, ProgressTrackerField, FormFieldInstance } from '../types';
import { Input, Label, Select, Textarea, Button } from './ui';

const Star = ({ filled, onMouseEnter, onClick }: { filled: boolean; onMouseEnter?: () => void; onClick?: () => void; }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
        fill={filled ? "currentColor" : "none"} 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-yellow-400"
        onMouseEnter={onMouseEnter}
        onClick={onClick}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

type FieldRendererProps = {
    field: FormFieldInstance;
    isPreviewing?: boolean;
    isReadOnly?: boolean;
    value?: any;
    onChange?: (fieldId: string, value: any) => void;
};

// Basic Fields
const RenderTextField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: TextField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <Input id={field.id} type={field.subtype} placeholder={field.placeholder} required={field.required} readOnly={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderTextareaField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: TextareaField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        {field.richText && (
             <div className="w-full bg-gray-900 border border-gray-700 rounded-md focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary">
                <div className="p-2 border-b border-gray-700 text-gray-400 text-xs italic">
                    Rich Text Editor (visual only)
                </div>
                <Textarea id={field.id} placeholder={field.placeholder} required={field.required} rows={field.rows} readOnly={!isPreviewing || isReadOnly} className="border-0 focus:ring-0" value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
             </div>
        )}
        {!field.richText && (
             <Textarea id={field.id} placeholder={field.placeholder} required={field.required} rows={field.rows} readOnly={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
        )}
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderSelectField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: SelectField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        {field.searchable ? (
            <div className="relative">
                 <Input id={field.id} type="text" placeholder={field.placeholder} required={field.required} readOnly={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
                 {isPreviewing && <p className="text-xs text-gray-500 mt-1 italic">Searchable dropdown</p>}
            </div>
        ) : (
            <Select id={field.id} required={field.required} disabled={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)}>
                <option value="">{field.placeholder}</option>
                {field.options.map(option => <option key={option.id} value={option.value}>{option.label}</option>)}
            </Select>
        )}
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderCheckboxField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: CheckboxField }) => (
    <div className="flex items-start" style={field.styles}>
        <div className="flex items-center h-5">
            <input id={field.id} type="checkbox" className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-600 rounded bg-gray-800" disabled={!isPreviewing || isReadOnly} checked={value ?? false} onChange={e => onChange?.(field.id, e.target.checked)} />
        </div>
        <div className="ml-3 text-sm">
            <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            {field.helperText && <p className="text-xs text-gray-400">{field.helperText}</p>}
        </div>
    </div>
);

const RenderRadioGroupField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: RadioGroupField }) => (
    <div style={field.styles}>
        <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <div className="mt-2 space-y-2">
            {field.options.map(option => (
                <div key={option.id} className="flex items-center">
                    <input id={`${field.id}-${option.id}`} name={field.id} type="radio" className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-600 bg-gray-800" disabled={!isPreviewing || isReadOnly} checked={value === option.value} onChange={() => onChange?.(field.id, option.value)} />
                    <label htmlFor={`${field.id}-${option.id}`} className="ml-3 block text-sm font-medium text-gray-300">{option.label}</label>
                </div>
            ))}
        </div>
        {field.helperText && <p className="text-xs text-gray-400 mt-2">{field.helperText}</p>}
    </div>
);


const RenderDatePickerField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: DatePickerField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <Input id={field.id} type="date" required={field.required} readOnly={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderTimeField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: TimeField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <Input id={field.id} type="time" required={field.required} readOnly={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderDateTimeField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: DateTimeField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <Input id={field.id} type="datetime-local" required={field.required} readOnly={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

// Advanced Fields
const RenderFileUploadField = ({ field, isPreviewing }: FieldRendererProps & { field: FileUploadField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md ${isPreviewing ? 'cursor-pointer hover:border-brand-primary' : ''}`}>
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-500">
                    <p className="pl-1">
                        {field.multiple ? 'Upload files or drag and drop' : 'Upload a file or drag and drop'}
                    </p>
                </div>
                <p className="text-xs text-gray-500">
                    Max size: {field.maxSizeInMb}MB. 
                    {field.allowedFileTypes && ` Types: ${field.allowedFileTypes}`}
                </p>
            </div>
        </div>
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderSignatureField = ({ field, isPreviewing }: FieldRendererProps & { field: SignatureField }) => {
    const [isSigning, setIsSigning] = useState(false);
    return (
        <div style={field.styles}>
            <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
            <div 
              className={`w-full h-32 bg-gray-800 border border-gray-600 rounded-md flex items-center justify-center relative ${isPreviewing ? 'cursor-crosshair' : ''}`}
              onMouseDown={isPreviewing ? () => setIsSigning(true) : undefined}
              onMouseUp={isPreviewing ? () => setIsSigning(false) : undefined}
              onMouseLeave={isPreviewing ? () => setIsSigning(false) : undefined}
            >
                <p className="text-gray-500 italic">Signature Pad</p>
                {isPreviewing && isSigning && <div className="absolute inset-0 text-gray-300 p-2 font-serif text-2xl italic">[Signing...]</div>}
            </div>
            {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
        </div>
    );
};

const RenderRatingField = ({ field, isPreviewing, value, onChange }: FieldRendererProps & { field: RatingField }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const rating = value ?? 0;
    return (
    <div style={field.styles}>
        <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <div 
            className={`flex space-x-1 ${isPreviewing ? 'cursor-pointer' : ''}`}
            onMouseLeave={isPreviewing ? () => setHoverRating(0) : undefined}
        >
            {Array.from({ length: field.maxRating }, (_, i) => (
                <Star 
                    key={i} 
                    filled={(hoverRating || rating) > i}
                    onMouseEnter={isPreviewing ? () => setHoverRating(i + 1) : undefined}
                    onClick={isPreviewing ? () => onChange?.(field.id, i + 1) : undefined}
                />
            ))}
        </div>
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
    );
};

const RenderCalculatedField = ({ field, value }: FieldRendererProps & { field: CalculatedField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label}</Label>
        <div className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300">
            {value ?? <span className="italic text-gray-400">Calculated Value</span>}
        </div>
         {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

// Advanced Field Renderers
const RenderMatrixField = ({ field, isPreviewing }: FieldRendererProps & { field: MatrixField }) => (
    <div style={field.styles}>
        <Label>{field.label}</Label>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 bg-gray-900">
                <thead className="bg-gray-850">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6"></th>
                        {field.columns.map(col => <th key={col.id} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-300">{col.label}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {field.rows.map(row => (
                        <tr key={row.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-300 sm:pl-6">{row.label}</td>
                            {field.columns.map(col => (
                                <td key={col.id} className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 text-center">
                                    {field.cellInputType === 'text' && <Input type="text" className="text-center" disabled={!isPreviewing} />}
                                    {field.cellInputType === 'number' && <Input type="number" className="w-20 text-center" disabled={!isPreviewing} />}
                                    {field.cellInputType === 'checkbox' && <input type="checkbox" className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-brand-primary focus:ring-brand-primary" disabled={!isPreviewing} />}
                                    {field.cellInputType === 'radio' && <input type="radio" name={`${field.id}-${row.id}`} className="h-4 w-4 bg-gray-800 border-gray-600 text-brand-primary focus:ring-brand-primary" disabled={!isPreviewing} />}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
         {field.helperText && <p className="text-xs text-gray-400 mt-2">{field.helperText}</p>}
    </div>
);

const RenderLookupField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: LookupField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <div className="relative">
             <Input id={field.id} type="text" placeholder={field.placeholder} required={field.required} readOnly={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
             </div>
             {isPreviewing && <p className="text-xs text-gray-500 mt-1 italic">Options are loaded dynamically from an external source.</p>}
        </div>
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderGeolocationField = ({ field, isPreviewing }: FieldRendererProps & { field: GeolocationField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <div className="w-full h-48 bg-gray-800 border border-gray-700 rounded-md flex flex-col items-center justify-center space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <Button variant="secondary" disabled={!isPreviewing}>Pin Location</Button>
        </div>
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

const RenderPaymentField = ({ field, isPreviewing }: FieldRendererProps & { field: PaymentField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label}</Label>
        <div className="space-y-3 p-4 bg-gray-850 border border-gray-700 rounded-md">
            <div className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 flex items-center justify-between">
                <span className="text-gray-400">Card Number</span>
                <div className="flex items-center space-x-1">
                    <svg className="h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-visa"><title id="pi-visa">Visa</title><g fill="none"><path fill="#000" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/><path d="M28.8 10.1c-.1-.4-.5-.7-.9-.7H26c-.4 0-.7.3-.8.7l-1.3 6.2c0 .4.3.7.7.7h1.5c.4 0 .7-.3.8-.7l.2-1.1h2.2l.2 1.1c0 .4.3.7.7.7h1.5c.4 0 .7-.3.7-.7l-1.3-6.2zm-2.9 3.3l.6-2.9.6 2.9h-1.2zM22.9 10.1c-.1-.4-.5-.7-.9-.7h-1.6c-.4 0-.7.3-.8.7l-1.3 6.2c0 .4.3.7.7.7h1.5c.4 0 .7-.3.8-.7l.2-1.1h2.2l.2 1.1c0 .4.3.7.7.7h1.5c.4 0 .7-.3.7-.7l-1.3-6.2zm-2.9 3.3l.6-2.9.6 2.9h-1.2zM17.1 10.1c-.1-.4-.5-.7-.9-.7h-1.5c-.4 0-.7.3-.8.7l-1.3 6.2c0 .4.3.7.7.7h1.5c.4 0 .7-.3.8-.7l.2-1.1h2.2l.2 1.1c0 .4.3.7.7.7h1.5c.4 0 .7-.3.7-.7l-1.3-6.2zm-2.9 3.3l.6-2.9.6 2.9h-1.2zM11.3 10.1c-.1-.4-.5-.7-.9-.7h-1.5c-.4 0-.7.3-.8.7l-1.3 6.2c0 .4.3.7.7.7h1.5c.4 0 .7-.3.8-.7l.2-1.1h2.2l.2 1.1c0 .4.3.7.7.7h1.5c.4 0 .7-.3.7-.7l-1.3-6.2zm-2.9 3.3l.6-2.9.6 2.9h-1.2z" fill="#00A1E5"/></g></svg>
                    <svg className="h-6" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-mastercard"><title id="pi-mastercard">Mastercard</title><g fill="none"><path fill="#000" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/><circle fill="#EB001B" cx="15" cy="12" r="7"/><circle fill="#F79E1B" cx="23" cy="12" r="7"/><path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/></g></svg>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-3">
                 <div className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2">
                    <span className="text-gray-400">MM / YY</span>
                </div>
                 <div className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2">
                    <span className="text-gray-400">CVC</span>
                </div>
            </div>
        </div>
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
        {field.gateway === 'paypal' && <p className="text-xs text-blue-400 mt-2 text-center italic">PayPal integration placeholder</p>}
    </div>
);

// Layout Fields
const RenderSectionBreak = ({ field }: FieldRendererProps & { field: SectionBreak }) => (
    <div className="py-2" style={field.styles}>
        <div className="flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-lg font-semibold text-gray-300">{field.label}</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>
        {field.description && <p className="text-sm text-gray-400 text-center mt-1">{field.description}</p>}
    </div>
);

const RenderPageBreak = ({ field }: FieldRendererProps & { field: PageBreak }) => (
    <div className="py-4">
        <div className="flex items-center justify-center">
            <div className="flex-grow border-t border-dashed border-brand-secondary"></div>
            <span className="flex-shrink mx-4 text-sm font-semibold uppercase text-brand-secondary">{field.label}</span>
            <div className="flex-grow border-t border-dashed border-brand-secondary"></div>
        </div>
    </div>
);

const RenderGroupField = (props: FieldRendererProps & { field: GroupField }) => (
    <div className="p-4 border border-gray-700 rounded-md" style={props.field.styles}>
        <h3 className="text-md font-semibold text-gray-300 mb-4">{props.field.label}</h3>
        <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${props.field.columns}, minmax(0, 1fr))` }}>
             {props.field.children.map(child => <FormFieldRenderer key={child.id} {...props} field={child} />)}
        </div>
    </div>
);

const RenderTabsField = (props: FieldRendererProps & { field: TabsField }) => {
    const [activeTab, setActiveTab] = useState(props.field.tabs[0]?.id);
    if (!props.field.tabs.length) return null;

    return (
        <div style={props.field.styles}>
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {props.field.tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                tab.id === activeTab
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="pt-6">
                {props.field.tabs.map(tab => (
                    <div key={tab.id} className={tab.id === activeTab ? 'space-y-6' : 'hidden'}>
                        {tab.children.map(child => <FormFieldRenderer key={child.id} {...props} field={child} />)}
                    </div>
                ))}
            </div>
        </div>
    );
};

const RenderImageField = ({ field }: FieldRendererProps & { field: ImageField }) => (
    <div style={field.styles}>
        <img 
            src={field.src} 
            alt={field.alt} 
            style={{ width: field.width, height: field.height }}
            className="rounded-md"
        />
    </div>
);

const RenderHtmlField = ({ field }: FieldRendererProps & { field: HtmlField }) => (
    <div dangerouslySetInnerHTML={{ __html: field.html }} className="prose prose-invert max-w-none" style={field.styles} />
);

// UX & Smart Controls
const RenderSliderField = ({ field, isPreviewing, isReadOnly, value, onChange }: FieldRendererProps & { field: SliderField }) => (
    <div style={field.styles}>
        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
        <input id={field.id} type="range" min={field.min} max={field.max} step={field.step} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" disabled={!isPreviewing || isReadOnly} value={value ?? ''} onChange={e => onChange?.(field.id, e.target.value)} />
        <div className="flex justify-between text-xs text-gray-400 px-1">
            <span>{field.min}</span>
            <span>{field.max}</span>
        </div>
        {field.helperText && <p className="text-xs text-gray-400 mt-1">{field.helperText}</p>}
    </div>
);

export const RenderProgressTracker = ({ currentStep, totalSteps, stepLabels }: { currentStep: number, totalSteps: number, stepLabels: string[] }) => (
    <div className="mb-8">
        <h3 className="text-center text-lg font-semibold text-gray-200 mb-1">Step {currentStep + 1} of {totalSteps}</h3>
        <p className="text-center text-gray-400 mb-4">{stepLabels[currentStep]}</p>
        <div className="flex items-center">
            {stepLabels.map((label, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index <= currentStep ? 'bg-brand-primary text-white' : 'bg-gray-700 text-gray-400'}`}>
                            {index + 1}
                        </div>
                    </div>
                    {index < totalSteps - 1 && <div className={`flex-1 h-1 ${index < currentStep ? 'bg-brand-primary' : 'bg-gray-700'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    </div>
);


const RenderRepeaterField = (props: FieldRendererProps & { field: RepeaterField }) => {
    const [instances, setInstances] = useState([crypto.randomUUID()]);

    const addInstance = () => setInstances(prev => [...prev, crypto.randomUUID()]);
    const removeInstance = (id: string) => setInstances(prev => prev.filter(i => i !== id));

    return (
        <div className="p-4 border border-gray-700 rounded-md bg-gray-900/50" style={props.field.styles}>
            <h3 className="text-md font-semibold text-gray-300 mb-4">{props.field.label}</h3>
            <div className="space-y-6">
                 {instances.map((instanceId) => (
                     <div key={instanceId} className="p-4 border border-gray-800 rounded-md relative bg-gray-850">
                         <div className="space-y-6">
                            {props.field.children.map(child => <FormFieldRenderer key={child.id} {...props} field={child} />)}
                         </div>
                         {props.isPreviewing && instances.length > 1 && (
                            <button onClick={() => removeInstance(instanceId)} className="absolute -top-2 -right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                         )}
                     </div>
                 ))}
            </div>
            {props.isPreviewing && (
                <Button onClick={addInstance} variant="secondary" className="mt-4 w-full">
                    {props.field.addButtonLabel}
                </Button>
            )}
        </div>
    );
}

const RenderABTestField = (props: FieldRendererProps & { field: ABTestField }) => {
    // In a real app, this would be a random choice. For preview, we'll just show Variant A.
    return (
        <div className="relative p-4 border-2 border-dashed border-purple-600 rounded-md" style={props.field.styles}>
            <div className="absolute top-0 right-0 -mt-3 mr-3 px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                A/B TEST: VARIANT A
            </div>
             <div className="space-y-6">
                {props.field.variantA.map(child => <FormFieldRenderer key={child.id} {...props} field={child} />)}
            </div>
        </div>
    );
};


export const FormFieldRenderer = (props: FieldRendererProps) => {
    const { field } = props;
    switch (field.type) {
        case FieldType.TextField: return <RenderTextField {...props} field={field} />;
        case FieldType.TextareaField: return <RenderTextareaField {...props} field={field} />;
        case FieldType.SelectField: return <RenderSelectField {...props} field={field} />;
        case FieldType.CheckboxField: return <RenderCheckboxField {...props} field={field} />;
        case FieldType.RadioGroupField: return <RenderRadioGroupField {...props} field={field} />;
        case FieldType.DatePickerField: return <RenderDatePickerField {...props} field={field} />;
        case FieldType.TimeField: return <RenderTimeField {...props} field={field} />;
        case FieldType.DateTimeField: return <RenderDateTimeField {...props} field={field} />;
        case FieldType.FileUploadField: return <RenderFileUploadField {...props} field={field} />;
        case FieldType.SignatureField: return <RenderSignatureField {...props} field={field} />;
        case FieldType.RatingField: return <RenderRatingField {...props} field={field} />;
        case FieldType.CalculatedField: return <RenderCalculatedField {...props} field={field} />;
        
        // Advanced
        case FieldType.MatrixField: return <RenderMatrixField {...props} field={field} />;
        case FieldType.LookupField: return <RenderLookupField {...props} field={field} />;
        case FieldType.GeolocationField: return <RenderGeolocationField {...props} field={field} />;
        case FieldType.PaymentField: return <RenderPaymentField {...props} field={field} />;

        // Layout
        case FieldType.SectionBreak: return <RenderSectionBreak {...props} field={field} />;
        case FieldType.PageBreak: return null; // Page breaks are handled by the canvas for layout
        case FieldType.GroupField: return <RenderGroupField {...props} field={field} />;
        case FieldType.TabsField: return <RenderTabsField {...props} field={field} />;
        case FieldType.ImageField: return <RenderImageField {...props} field={field} />;
        case FieldType.HtmlField: return <RenderHtmlField {...props} field={field} />;

        // UX & Smart
        case FieldType.SliderField: return <RenderSliderField {...props} field={field} />;
        case FieldType.ProgressTrackerField: return null; // Progress tracker is rendered specially by the canvas
        case FieldType.RepeaterField: return <RenderRepeaterField {...props} field={field} />;
        case FieldType.ABTestField: return <RenderABTestField {...props} field={field} />;

        default: return <div className="text-red-500">Unknown field type</div>;
    }
};
