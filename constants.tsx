
import React from 'react';
import { FieldType, FormElements, TextField, TextFieldSubtype } from './types';

// Icon Components (using inline SVG for simplicity)
const TypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>;
const PilcrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const CheckSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const CircleDotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const PenToolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const SlidersHorizontalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>;
const SeparatorHorizontalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><polyline points="8 8 4 12 8 16"/><polyline points="16 16 20 12 16 8"/></svg>;
const SigmaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>;

// Basic Input Icons
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const KeyRoundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CalendarClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.25V14"/><path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"/></svg>;

// Layout Icons
const LayoutPanelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>;
const PageBreakIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const TabsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;

// Advanced Icons
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;

// UX & Smart Icons
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5c1.9 1.9 1.9 5.1 0 7l-7 7c-1.9 1.9-5.1 1.9-7 0s-1.9-5.1 0-7l7-7c1.9-1.9 5.1-1.9 7 0Z"/><path d="m2 2 20 20"/><path d="M18 12.5V10h-2.5"/><path d="m5 5.5 2 2"/><path d="m11 11.5 2 2"/><path d="m8 8.5 2 2"/></svg>;
const RepeaterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.1a9.9 9.9 0 1 0 0 19.8"/><path d="M17 8h-2.1"/><path d="M17 12h-4.1"/><path d="M17 16H9"/><path d="m11 12-2-2 2-2"/><path d="M7 12h2"/></svg>;
const TestTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>;

const commonFieldProps = {
    defaultValue: '',
    styles: {},
    logic: [],
    validation: { regex: '', errorMessage: '' },
    readOnly: false,
};

const createTextFieldElement = (subtype: TextFieldSubtype, label: string, icon: React.ReactNode) => {
    return {
        type: FieldType.TextField,
        subtype,
        construct: (id: string): TextField => ({
            id,
            type: FieldType.TextField,
            subtype,
            label,
            placeholder: 'Value here...',
            helperText: 'Helper text',
            required: false,
            ...commonFieldProps,
        }),
        label,
        icon,
        category: 'Basic' as const
    };
};

export const FORM_ELEMENTS: FormElements = {
    TextField: createTextFieldElement('text', 'Text Field', <TypeIcon />),
    EmailField: createTextFieldElement('email', 'Email Field', <MailIcon />),
    PhoneField: createTextFieldElement('phone', 'Phone Field', <PhoneIcon />),
    UrlField: createTextFieldElement('url', 'URL Field', <LinkIcon />),
    PasswordField: createTextFieldElement('password', 'Password Field', <KeyRoundIcon />),
    
    [FieldType.TextareaField]: {
        type: FieldType.TextareaField,
        construct: (id) => ({
            id,
            type: FieldType.TextareaField,
            label: 'Textarea Field',
            placeholder: 'Value here...',
            helperText: 'Helper text',
            required: false,
            rows: 3,
            richText: false,
            ...commonFieldProps,
        }),
        label: 'Textarea',
        icon: <PilcrowIcon />,
        category: 'Basic'
    },
    [FieldType.SelectField]: {
        type: FieldType.SelectField,
        construct: (id) => ({
            id,
            type: FieldType.SelectField,
            label: 'Select Field',
            placeholder: 'Select an option',
            helperText: 'Helper text',
            required: false,
            options: [{ id: '1', label: 'Option 1', value: 'option1' }],
            searchable: false,
            ...commonFieldProps,
        }),
        label: 'Select',
        icon: <ChevronDownIcon />,
        category: 'Basic'
    },
    [FieldType.CheckboxField]: {
        type: FieldType.CheckboxField,
        construct: (id) => ({
            id,
            type: FieldType.CheckboxField,
            label: 'Checkbox Field',
            helperText: 'Helper text',
            required: false,
            ...commonFieldProps,
            defaultValue: false,
        }),
        label: 'Checkbox',
        icon: <CheckSquareIcon />,
        category: 'Basic'
    },
    [FieldType.RadioGroupField]: {
        type: FieldType.RadioGroupField,
        construct: (id) => ({
            id,
            type: FieldType.RadioGroupField,
            label: 'Radio Group',
            helperText: 'Helper text',
            required: false,
            options: [{ id: '1', label: 'Option 1', value: 'option1' }],
            ...commonFieldProps,
        }),
        label: 'Radio Group',
        icon: <CircleDotIcon />,
        category: 'Basic'
    },
    [FieldType.DatePickerField]: {
        type: FieldType.DatePickerField,
        construct: (id) => ({
            id,
            type: FieldType.DatePickerField,
            label: 'Date Picker',
            helperText: 'Helper text',
            required: false,
            ...commonFieldProps,
        }),
        label: 'Date Picker',
        icon: <CalendarIcon />,
        category: 'Basic'
    },
    [FieldType.TimeField]: {
        type: FieldType.TimeField,
        construct: (id) => ({
            id,
            type: FieldType.TimeField,
            label: 'Time Picker',
            helperText: 'Helper text',
            required: false,
            ...commonFieldProps,
        }),
        label: 'Time Picker',
        icon: <ClockIcon />,
        category: 'Basic'
    },
    [FieldType.DateTimeField]: {
        type: FieldType.DateTimeField,
        construct: (id) => ({
            id,
            type: FieldType.DateTimeField,
            label: 'Date Time Picker',
            helperText: 'Helper text',
            required: false,
            ...commonFieldProps,
        }),
        label: 'Date Time Picker',
        icon: <CalendarClockIcon />,
        category: 'Basic'
    },
    // Layout Elements
    [FieldType.SectionBreak]: {
        type: FieldType.SectionBreak,
        construct: (id) => ({
            id,
            type: FieldType.SectionBreak,
            label: 'Section Break',
            description: 'A description for the new section',
            ...commonFieldProps,
        }),
        label: 'Section Break',
        icon: <SeparatorHorizontalIcon />,
        category: 'Layout'
    },
    [FieldType.GroupField]: {
        type: FieldType.GroupField,
        construct: (id) => ({
            id,
            type: FieldType.GroupField,
            label: 'Container',
            children: [],
            columns: 1,
            ...commonFieldProps,
        }),
        label: 'Container (Grid)',
        icon: <LayoutPanelIcon />,
        category: 'Layout',
    },
    [FieldType.PageBreak]: {
        type: FieldType.PageBreak,
        construct: (id) => ({
            id,
            type: FieldType.PageBreak,
            label: 'Page Break',
            ...commonFieldProps,
        }),
        label: 'Page Break',
        icon: <PageBreakIcon />,
        category: 'Layout',
    },
    [FieldType.TabsField]: {
        type: FieldType.TabsField,
        construct: (id) => ({
            id,
            type: FieldType.TabsField,
            label: 'Tabs',
            tabs: [
                { id: crypto.randomUUID(), label: 'Tab 1', children: [] },
                { id: crypto.randomUUID(), label: 'Tab 2', children: [] },
            ],
            ...commonFieldProps,
        }),
        label: 'Tabs',
        icon: <TabsIcon />,
        category: 'Layout',
    },
    [FieldType.ImageField]: {
        type: FieldType.ImageField,
        construct: (id) => ({
            id,
            type: FieldType.ImageField,
            label: 'Image',
            src: 'https://via.placeholder.com/400x200',
            alt: 'Placeholder Image',
            width: '100%',
            height: 'auto',
            ...commonFieldProps,
        }),
        label: 'Image',
        icon: <ImageIcon />,
        category: 'Layout',
    },
    [FieldType.HtmlField]: {
        type: FieldType.HtmlField,
        construct: (id) => ({
            id,
            type: FieldType.HtmlField,
            label: 'HTML Embed',
            html: '<p>Your custom HTML here.</p>',
            ...commonFieldProps,
        }),
        label: 'HTML Embed',
        icon: <CodeIcon />,
        category: 'Layout',
    },

    // Advanced Elements
    [FieldType.FileUploadField]: {
        type: FieldType.FileUploadField,
        construct: (id) => ({
            id,
            type: FieldType.FileUploadField,
            label: 'File Upload',
            helperText: 'Helper text',
            required: false,
            multiple: false,
            maxSizeInMb: 5,
            allowedFileTypes: '',
            ...commonFieldProps,
        }),
        label: 'File Upload',
        icon: <UploadIcon />,
        category: 'Advanced'
    },
    [FieldType.SignatureField]: {
        type: FieldType.SignatureField,
        construct: (id) => ({
            id,
            type: FieldType.SignatureField,
            label: 'Signature',
            helperText: 'Please sign here',
            required: false,
            ...commonFieldProps,
        }),
        label: 'Signature',
        icon: <PenToolIcon />,
        category: 'Advanced'
    },
    [FieldType.RatingField]: {
        type: FieldType.RatingField,
        construct: (id) => ({
            id,
            type: FieldType.RatingField,
            label: 'Rating',
            helperText: 'Rate your experience',
            required: false,
            maxRating: 5,
            ...commonFieldProps,
            defaultValue: 0,
        }),
        label: 'Rating',
        icon: <StarIcon />,
        category: 'Advanced'
    },
     [FieldType.CalculatedField]: {
        type: FieldType.CalculatedField,
        construct: (id) => ({
            id,
            type: FieldType.CalculatedField,
            label: 'Calculated Field',
            formula: '',
            helperText: 'This field is calculated automatically',
            formatting: 'none',
            ...commonFieldProps,
        }),
        label: 'Calculated Field',
        icon: <SigmaIcon />,
        category: 'Advanced'
    },
    [FieldType.MatrixField]: {
        type: FieldType.MatrixField,
        construct: (id) => ({
            id,
            type: FieldType.MatrixField,
            label: 'Matrix Table',
            rows: [{id: crypto.randomUUID(), label: 'Row 1'}, {id: crypto.randomUUID(), label: 'Row 2'}],
            columns: [{id: crypto.randomUUID(), label: 'Column 1'}, {id: crypto.randomUUID(), label: 'Column 2'}],
            cellInputType: 'text',
            helperText: 'Fill out the table below.',
            ...commonFieldProps,
        }),
        label: 'Matrix Table',
        icon: <TableIcon />,
        category: 'Advanced'
    },
    [FieldType.LookupField]: {
        type: FieldType.LookupField,
        construct: (id) => ({
            id,
            type: FieldType.LookupField,
            label: 'Lookup Field',
            placeholder: 'Search for an item...',
            helperText: 'This dropdown is populated from an external source.',
            required: false,
            dataSourceUrl: 'https://api.example.com/data',
            ...commonFieldProps,
        }),
        label: 'Lookup/Dynamic Dropdown',
        icon: <SearchIcon />,
        category: 'Advanced'
    },
    [FieldType.GeolocationField]: {
        type: FieldType.GeolocationField,
        construct: (id) => ({
            id,
            type: FieldType.GeolocationField,
            label: 'Location Picker',
            helperText: 'Pin a location on the map.',
            required: false,
            ...commonFieldProps,
        }),
        label: 'Geolocation Picker',
        icon: <MapPinIcon />,
        category: 'Advanced'
    },
    [FieldType.PaymentField]: {
        type: FieldType.PaymentField,
        construct: (id) => ({
            id,
            type: FieldType.PaymentField,
            label: 'Payment Information',
            gateway: 'stripe',
            helperText: 'Your payment information is secure.',
            ...commonFieldProps,
        }),
        label: 'Payment Gateway',
        icon: <CreditCardIcon />,
        category: 'Advanced'
    },
    // UX & Smart Controls
    [FieldType.SliderField]: {
        type: FieldType.SliderField,
        construct: (id) => ({
            id,
            type: FieldType.SliderField,
            label: 'Slider',
            helperText: 'Select a value',
            required: false,
            min: 0,
            max: 100,
            step: 1,
            ...commonFieldProps,
            defaultValue: 50,
        }),
        label: 'Slider',
        icon: <SlidersHorizontalIcon />,
        category: 'UX & Smart'
    },
    [FieldType.ProgressTrackerField]: {
        type: FieldType.ProgressTrackerField,
        construct: (id) => ({
            id,
            type: FieldType.ProgressTrackerField,
            label: 'Progress Tracker',
            ...commonFieldProps,
        }),
        label: 'Progress Tracker',
        icon: <ProgressIcon />,
        category: 'UX & Smart',
    },
    [FieldType.RepeaterField]: {
        type: FieldType.RepeaterField,
        construct: (id) => ({
            id,
            type: FieldType.RepeaterField,
            label: 'Replicating Group',
            children: [],
            addButtonLabel: 'Add another item',
            ...commonFieldProps,
        }),
        label: 'Replicating Group',
        icon: <RepeaterIcon />,
        category: 'UX & Smart',
    },
    [FieldType.ABTestField]: {
        type: FieldType.ABTestField,
        construct: (id) => ({
            id,
            type: FieldType.ABTestField,
            label: 'A/B Test Variant',
            variantA: [],
            variantB: [],
            ...commonFieldProps,
        }),
        label: 'A/B Test Variant',
        icon: <TestTubeIcon />,
        category: 'UX & Smart',
    },
};
