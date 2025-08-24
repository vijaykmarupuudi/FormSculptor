import React, { useContext, useState, useMemo } from 'react';
import { FormBuilderContext } from '../App';
import { FormFieldInstance, FieldType, FieldOption, TextFieldSubtype, TabsField, GroupField, ImageField, HtmlField, FileUploadField, RatingField, SliderField, SectionBreak, CalculatedField, MatrixField, MatrixCellInputType, MatrixRow, MatrixCol, LookupField, PaymentField, PaymentGateway, RepeaterField, LogicRule, LogicAction, ConditionGroup, LogicCondition, CalculatedFieldFormat, UrlParameterMapping, FormSettings } from '../types';
import { Input, Label, Switch, Textarea, Button, Select } from './ui';
import { FORM_ELEMENTS } from '../constants';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;

// Reusable Property Components
const PropertyGroup = ({ children, title }: { children: React.ReactNode, title?: string }) => (
    <div className="space-y-4">
        {title && <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>}
        {children}
    </div>
);

// Basic Properties
const BasicProperties = ({ field }: { field: FormFieldInstance }) => {
    const { updateField } = useContext(FormBuilderContext);

    return (
        <PropertyGroup>
            <div>
                <Label htmlFor="label">Label</Label>
                <Input id="label" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} />
            </div>

            {'placeholder' in field && (
                <div>
                    <Label htmlFor="placeholder">Placeholder</Label>
                    <Input id="placeholder" value={(field as any).placeholder} onChange={e => updateField(field.id, { placeholder: e.target.value })} />
                </div>
            )}
             
            {'helperText' in field && (
                <div>
                    <Label htmlFor="helperText">Helper Text</Label>
                    <Input id="helperText" value={(field as any).helperText} onChange={e => updateField(field.id, { helperText: e.target.value })} />
                </div>
            )}

            {'description' in field && field.type === FieldType.SectionBreak && (
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={field.description} onChange={e => updateField(field.id, { description: e.target.value })} rows={3} />
                </div>
             )}

            {'defaultValue' in field && (
                <div>
                    <Label htmlFor="defaultValue">Default Value</Label>
                    <Input id="defaultValue" value={field.defaultValue ?? ''} onChange={e => updateField(field.id, { defaultValue: e.target.value })} />
                </div>
            )}

            {'required' in field && (
                 <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="required">Required</Label>
                    <Switch checked={(field as any).required} onChange={checked => updateField(field.id, { required: checked })} />
                </div>
            )}
        </PropertyGroup>
    );
};

// Design Properties
const DesignProperties = ({ field }: { field: FormFieldInstance }) => {
    const { updateField } = useContext(FormBuilderContext);
    
    const handleStyleChange = (prop: keyof React.CSSProperties, value: string) => {
        updateField(field.id, { styles: { ...field.styles, [prop]: value } });
    };

    return (
        <PropertyGroup>
            <div>
                <Label htmlFor="width">Width</Label>
                <Input id="width" value={field.styles?.width as string || ''} onChange={e => handleStyleChange('width', e.target.value)} placeholder="e.g. 100% or 250px" />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
                 <div>
                    <Label htmlFor="backgroundColor">Bg Color</Label>
                    <Input id="backgroundColor" type="color" value={field.styles?.backgroundColor as string || '#1f2937'} onChange={e => handleStyleChange('backgroundColor', e.target.value)} className="p-1 h-10" />
                </div>
                <div>
                    <Label htmlFor="borderColor">Border</Label>
                    <Input id="borderColor" type="color" value={field.styles?.borderColor as string || '#334155'} onChange={e => handleStyleChange('borderColor', e.target.value)} className="p-1 h-10" />
                </div>
                <div>
                    <Label htmlFor="color">Text</Label>
                    <Input id="color" type="color" value={field.styles?.color as string || '#f1f5f9'} onChange={e => handleStyleChange('color', e.target.value)} className="p-1 h-10" />
                </div>
            </div>
        </PropertyGroup>
    )
}

// Logic Properties
const LogicProperties = ({ field }: { field: FormFieldInstance }) => {
    const { fields, updateField } = useContext(FormBuilderContext);

    const getOtherFields = () => {
        const allFields: FormFieldInstance[] = [];
        const recurse = (items: FormFieldInstance[]) => {
            for (const item of items) {
                if (item.id !== field.id) allFields.push(item);
                if ('children' in item && Array.isArray(item.children)) recurse(item.children);
                if ('tabs' in item && Array.isArray(item.tabs)) item.tabs.forEach(t => recurse(t.children));
            }
        };
        recurse(fields);
        return allFields;
    };
    
    const otherFields = getOtherFields();
    
    const updateRule = (ruleId: string, newRuleProps: Partial<LogicRule>) => {
        const newLogic = (field.logic || []).map(r => r.id === ruleId ? {...r, ...newRuleProps} : r);
        updateField(field.id, { logic: newLogic });
    };

    const addRule = () => {
        const newRule: LogicRule = { 
            id: crypto.randomUUID(), 
            name: `Rule ${ (field.logic?.length || 0) + 1 }`,
            conditions: { conjunction: 'and', conditions: [] },
            actions: []
        };
        updateField(field.id, { logic: [...(field.logic || []), newRule] });
    };

    const removeRule = (ruleId: string) => {
        updateField(field.id, { logic: (field.logic || []).filter(r => r.id !== ruleId) });
    };

    const handleValidationChange = (prop: 'regex' | 'errorMessage', value: string) => {
        updateField(field.id, { validation: { ...field.validation, [prop]: value } });
    }

    const showValidation = [FieldType.TextField, FieldType.TextareaField].includes(field.type);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {(field.logic || []).map(rule => (
                    <RuleBuilder key={rule.id} rule={rule} allFields={otherFields} updateRule={updateRule} removeRule={() => removeRule(rule.id)} />
                ))}
            </div>
            <Button onClick={addRule} variant="secondary" className="w-full text-xs">Add Rule</Button>
            
            {showValidation && (
                <PropertyGroup title="Validation Rules">
                    <div>
                        <Label htmlFor="regex">RegEx Pattern</Label>
                        <Input id="regex" value={field.validation?.regex || ''} onChange={e => handleValidationChange('regex', e.target.value)} placeholder="e.g., ^\d{5}$" />
                    </div>
                     <div>
                        <Label htmlFor="errorMessage">Error Message</Label>
                        <Input id="errorMessage" value={field.validation?.errorMessage || ''} onChange={e => handleValidationChange('errorMessage', e.target.value)} placeholder="e.g., Invalid ZIP code" />
                    </div>
                </PropertyGroup>
            )}
        </div>
    );
};

const RuleBuilder = ({ rule, allFields, updateRule, removeRule }: { rule: LogicRule, allFields: FormFieldInstance[], updateRule: (ruleId: string, props: Partial<LogicRule>) => void, removeRule: () => void }) => {

    const updateConditionGroup = (newGroup: Partial<ConditionGroup>) => {
        updateRule(rule.id, { conditions: { ...rule.conditions, ...newGroup } });
    };

    const updateCondition = (condId: string, prop: keyof LogicCondition, value: any) => {
        const newConditions = rule.conditions.conditions.map(c => c.id === condId ? { ...c, [prop]: value } : c);
        updateConditionGroup({ conditions: newConditions });
    };

    const addCondition = () => {
        const newCond: LogicCondition = { id: crypto.randomUUID(), sourceField: '', operator: 'eq', value: '' };
        updateConditionGroup({ conditions: [...rule.conditions.conditions, newCond] });
    };

    const removeCondition = (condId: string) => {
        updateConditionGroup({ conditions: rule.conditions.conditions.filter(c => c.id !== condId) });
    };

    const updateAction = (actionId: string, prop: keyof LogicAction, value: any) => {
        const newActions = rule.actions.map(a => a.id === actionId ? { ...a, [prop]: value } : a);
        updateRule(rule.id, { actions: newActions });
    };

    const addAction = () => {
        const newAction: LogicAction = { id: crypto.randomUUID(), actionType: 'show', targetFieldId: '' };
        updateRule(rule.id, { actions: [...rule.actions, newAction] });
    };
    
    const removeAction = (actionId: string) => {
        updateRule(rule.id, { actions: rule.actions.filter(a => a.id !== actionId) });
    };

    return (
        <div className="p-3 bg-slate-850 rounded-md space-y-3 border border-slate-700">
            <div className="flex justify-between items-center">
                <Input value={rule.name} onChange={e => updateRule(rule.id, { name: e.target.value })} className="bg-transparent border-0 text-base font-semibold p-0 focus:ring-0" />
                <button onClick={removeRule} className="p-1 text-slate-400 hover:text-red-500"><TrashIcon /></button>
            </div>
            
            {/* Conditions */}
            <div className="p-2 bg-slate-900 rounded">
                <p className="text-xs font-semibold text-slate-400 mb-2">IF</p>
                <div className="flex items-center space-x-2 mb-2">
                    <button onClick={() => updateConditionGroup({ conjunction: 'and' })} className={`px-2 py-0.5 text-xs rounded ${rule.conditions.conjunction === 'and' ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}>All (AND)</button>
                    <button onClick={() => updateConditionGroup({ conjunction: 'or' })} className={`px-2 py-0.5 text-xs rounded ${rule.conditions.conjunction === 'or' ? 'bg-blue-600 text-white' : 'bg-slate-700'}`}>Any (OR)</button>
                </div>
                <div className="space-y-2">
                     {rule.conditions.conditions.map(cond => (
                         <div key={cond.id} className="grid grid-cols-[1fr_auto] gap-2 items-center">
                             <div className="grid grid-cols-2 gap-2">
                                <Select value={cond.sourceField} onChange={e => updateCondition(cond.id, 'sourceField', e.target.value)}>
                                    <option value="">Select a field...</option>
                                    {allFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                </Select>
                                 <Select value={cond.operator} onChange={e => updateCondition(cond.id, 'operator', e.target.value)}>
                                    <option value="eq">is equal to</option>
                                    <option value="neq">is not equal to</option>
                                    <option value="gt">is greater than</option>
                                    <option value="lt">is less than</option>
                                    <option value="contains">contains</option>
                                    <option value="not_contains">does not contain</option>
                                    <option value="is_empty">is empty</option>
                                    <option value="is_not_empty">is not empty</option>
                                </Select>
                            </div>
                             <button onClick={() => removeCondition(cond.id)} className="p-1 text-slate-400 hover:text-red-500"><TrashIcon/></button>
                             <div className="col-span-2">
                                <Input value={cond.value} onChange={e => updateCondition(cond.id, 'value', e.target.value)} placeholder="Value"/>
                             </div>
                         </div>
                     ))}
                </div>
                <Button onClick={addCondition} variant="secondary" className="w-full text-xs mt-2">Add Condition</Button>
            </div>

            {/* Actions */}
            <div className="p-2 bg-slate-900 rounded">
                <p className="text-xs font-semibold text-slate-400 mb-2">THEN</p>
                 <div className="space-y-2">
                    {rule.actions.map(action => (
                         <div key={action.id} className="grid grid-cols-[1fr_auto] gap-2 items-center">
                             <div className="grid grid-cols-2 gap-2">
                                 <Select value={action.actionType} onChange={e => updateAction(action.id, 'actionType', e.target.value)}>
                                     <option value="show">Show</option>
                                     <option value="hide">Hide</option>
                                     <option value="enable">Enable</option>
                                     <option value="disable">Disable</option>
                                     <option value="setValue">Set Value</option>
                                 </Select>
                                 <Select value={action.targetFieldId} onChange={e => updateAction(action.id, 'targetFieldId', e.target.value)}>
                                     <option value="">Select target field...</option>
                                     {allFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                 </Select>
                            </div>
                             <button onClick={() => removeAction(action.id)} className="p-1 text-slate-400 hover:text-red-500"><TrashIcon/></button>
                              {action.actionType === 'setValue' && (
                                <div className="col-span-2">
                                    <Input value={action.value ?? ''} onChange={e => updateAction(action.id, 'value', e.target.value)} placeholder="Value to set" />
                                </div>
                            )}
                         </div>
                    ))}
                 </div>
                 <Button onClick={addAction} variant="secondary" className="w-full text-xs mt-2">Add Action</Button>
            </div>
        </div>
    )
}

// Field-Specific Property Components
const TextFieldProperties = ({ field }: { field: FormFieldInstance & { type: FieldType.TextField } }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Text Field Options">
            <div>
                <Label htmlFor="subtype">Input Type</Label>
                <Select id="subtype" value={field.subtype} onChange={e => updateField(field.id, { subtype: e.target.value as TextFieldSubtype })}>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="url">URL</option>
                    <option value="password">Password</option>
                </Select>
            </div>
        </PropertyGroup>
    );
};

const TextareaProperties = ({ field }: { field: FormFieldInstance & { type: FieldType.TextareaField } }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Textarea Options">
            <div>
                <Label htmlFor="rows">Rows</Label>
                <Input id="rows" type="number" value={field.rows} onChange={e => updateField(field.id, { rows: parseInt(e.target.value) })} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="richText">Enable Rich Text</Label>
                <Switch checked={field.richText} onChange={checked => updateField(field.id, { richText: checked })} />
            </div>
        </PropertyGroup>
    );
};

const OptionsProperties = ({ field }: { field: FormFieldInstance & { options: FieldOption[] } }) => {
    const { updateField } = useContext(FormBuilderContext);
    if (field.type !== FieldType.SelectField && field.type !== FieldType.RadioGroupField) return null;

    const addOption = () => {
        const newOption: FieldOption = { id: crypto.randomUUID(), label: 'New Option', value: 'new_option' };
        updateField(field.id, { options: [...field.options, newOption] });
    };

    const removeOption = (optionId: string) => {
        updateField(field.id, { options: field.options.filter(o => o.id !== optionId) });
    };

    const updateOption = (optionId: string, newLabel: string) => {
        const newOptions = field.options.map(o => o.id === optionId ? { ...o, label: newLabel, value: newLabel.toLowerCase().replace(/\s/g, '_') } : o);
        updateField(field.id, { options: newOptions });
    };

    return (
        <PropertyGroup title="Options">
            <div className="space-y-2 mt-2">
                {field.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                        <Input value={option.label} onChange={e => updateOption(option.id, e.target.value)} />
                        <button onClick={() => removeOption(option.id)} className="p-2 text-slate-400 hover:text-red-500">
                            <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
            <Button onClick={addOption} variant="secondary" className="mt-3 w-full flex items-center justify-center space-x-2">
                <PlusIcon/>
                <span>Add Option</span>
            </Button>
        </PropertyGroup>
    );
};

const SelectProperties = ({ field }: { field: FormFieldInstance & { type: FieldType.SelectField }}) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
         <PropertyGroup title="Select Field Options">
             <div className="flex items-center justify-between">
                <Label htmlFor="searchable">Searchable Dropdown</Label>
                <Switch checked={field.searchable} onChange={checked => updateField(field.id, { searchable: checked })} />
            </div>
         </PropertyGroup>
    );
};

const FileUploadProperties = ({ field }: { field: FileUploadField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
         <PropertyGroup title="File Upload Options">
            <div className="flex items-center justify-between">
                <Label htmlFor="multiple">Allow Multiple Files</Label>
                <Switch checked={field.multiple} onChange={checked => updateField(field.id, { multiple: checked })} />
            </div>
            <div>
                <Label htmlFor="maxSizeInMb">Max File Size (MB)</Label>
                <Input id="maxSizeInMb" type="number" min="1" value={field.maxSizeInMb} onChange={e => updateField(field.id, { maxSizeInMb: parseInt(e.target.value) })} />
            </div>
             <div>
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Input id="allowedFileTypes" placeholder="image/png, .pdf" value={field.allowedFileTypes} onChange={e => updateField(field.id, { allowedFileTypes: e.target.value })} />
                 <p className="text-xs text-slate-500 mt-1">Comma-separated list of MIME types or extensions.</p>
            </div>
         </PropertyGroup>
    );
};

const RatingProperties = ({ field }: { field: RatingField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Rating Options">
            <div>
                <Label htmlFor="maxRating">Max Rating (e.g., 5 for 5 stars)</Label>
                <Input id="maxRating" type="number" min="2" max="10" value={field.maxRating} onChange={e => updateField(field.id, { maxRating: parseInt(e.target.value) || 5 })} />
            </div>
        </PropertyGroup>
    );
};

const SliderProperties = ({ field }: { field: SliderField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Slider Options">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="min">Min Value</Label>
                    <Input id="min" type="number" value={field.min} onChange={e => updateField(field.id, { min: parseInt(e.target.value) })} />
                </div>
                <div>
                    <Label htmlFor="max">Max Value</Label>
                    <Input id="max" type="number" value={field.max} onChange={e => updateField(field.id, { max: parseInt(e.target.value) })} />
                </div>
            </div>
             <div>
                <Label htmlFor="step">Step</Label>
                <Input id="step" type="number" value={field.step} onChange={e => updateField(field.id, { step: parseInt(e.target.value) })} />
            </div>
        </PropertyGroup>
    );
};

const CalculatedFieldProperties = ({ field }: { field: CalculatedField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Calculation Options">
             <div>
                <Label htmlFor="formula">Formula</Label>
                <Textarea id="formula" value={field.formula} onChange={e => updateField(field.id, { formula: e.target.value })} rows={4} placeholder="e.g. {field_id_1} + {field_id_2}" />
                 <p className="text-xs text-slate-500 mt-1">Reference other fields using their ID in curly braces.</p>
            </div>
            <div>
                <Label htmlFor="formatting">Output Formatting</Label>
                <Select id="formatting" value={field.formatting} onChange={e => updateField(field.id, { formatting: e.target.value as CalculatedFieldFormat })}>
                    <option value="none">None</option>
                    <option value="currency_usd">Currency (USD)</option>
                </Select>
            </div>
        </PropertyGroup>
    );
};

const MatrixProperties = ({ field }: { field: MatrixField }) => {
    const { updateField } = useContext(FormBuilderContext);
    
    const updateList = (list: 'rows' | 'columns', id: string, label: string) => {
        const newList = field[list].map(item => item.id === id ? { ...item, label } : item);
        updateField(field.id, { [list]: newList });
    };

    const addToList = (list: 'rows' | 'columns') => {
        const newItem = { id: crypto.randomUUID(), label: `New ${list === 'rows' ? 'Row' : 'Column'}` };
        updateField(field.id, { [list]: [...field[list], newItem] });
    };
    
    const removeFromList = (list: 'rows' | 'columns', id: string) => {
        const newList = field[list].filter(item => item.id !== id);
        updateField(field.id, { [list]: newList });
    };

    return (
        <PropertyGroup title="Matrix Options">
             <div>
                <Label htmlFor="cellInputType">Cell Input Type</Label>
                <Select id="cellInputType" value={field.cellInputType} onChange={e => updateField(field.id, { cellInputType: e.target.value as MatrixCellInputType })}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio Button</option>
                </Select>
            </div>
            <div>
                <Label>Rows</Label>
                <div className="space-y-2">
                    {field.rows.map(row => (
                        <div key={row.id} className="flex items-center space-x-2">
                            <Input value={row.label} onChange={e => updateList('rows', row.id, e.target.value)} />
                            <button onClick={() => removeFromList('rows', row.id)} className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-50" disabled={field.rows.length <= 1}> <TrashIcon /> </button>
                        </div>
                    ))}
                </div>
                 <Button onClick={() => addToList('rows')} variant="secondary" className="mt-2 w-full text-xs">Add Row</Button>
            </div>
             <div>
                <Label>Columns</Label>
                <div className="space-y-2">
                    {field.columns.map(col => (
                        <div key={col.id} className="flex items-center space-x-2">
                            <Input value={col.label} onChange={e => updateList('columns', col.id, e.target.value)} />
                            <button onClick={() => removeFromList('columns', col.id)} className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-50" disabled={field.columns.length <= 1}> <TrashIcon /> </button>
                        </div>
                    ))}
                </div>
                 <Button onClick={() => addToList('columns')} variant="secondary" className="mt-2 w-full text-xs">Add Column</Button>
            </div>
        </PropertyGroup>
    );
};

const LookupProperties = ({ field }: { field: LookupField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Lookup Options">
            <div>
                <Label htmlFor="dataSourceUrl">Data Source URL</Label>
                <Input id="dataSourceUrl" value={field.dataSourceUrl} onChange={e => updateField(field.id, { dataSourceUrl: e.target.value })} />
                 <p className="text-xs text-slate-500 mt-1">Provide an API endpoint to fetch options from.</p>
            </div>
        </PropertyGroup>
    );
};

const PaymentProperties = ({ field }: { field: PaymentField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Payment Options">
            <div>
                <Label htmlFor="gateway">Payment Gateway</Label>
                <Select id="gateway" value={field.gateway} onChange={e => updateField(field.id, { gateway: e.target.value as PaymentGateway })}>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                </Select>
            </div>
        </PropertyGroup>
    );
}

const GroupProperties = ({ field }: { field: GroupField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Container Options">
            <div>
                <Label htmlFor="columns">Number of Columns</Label>
                <Input id="columns" type="number" min="1" max="4" value={field.columns} onChange={e => updateField(field.id, { columns: parseInt(e.target.value) || 1 })} />
            </div>
        </PropertyGroup>
    );
};

const TabsProperties = ({ field }: { field: TabsField }) => {
    const { updateField } = useContext(FormBuilderContext);
    
    const addTab = () => {
        const newTab = { id: crypto.randomUUID(), label: `Tab ${field.tabs.length + 1}`, children: [] };
        updateField(field.id, { tabs: [...field.tabs, newTab] });
    };

    const removeTab = (tabId: string) => {
        updateField(field.id, { tabs: field.tabs.filter(t => t.id !== tabId) });
    };

    const updateTabLabel = (tabId: string, newLabel: string) => {
        const newTabs = field.tabs.map(t => t.id === tabId ? { ...t, label: newLabel } : t);
        updateField(field.id, { tabs: newTabs });
    };

    return (
        <PropertyGroup title="Tab Options">
             <div className="space-y-2 mt-2">
                {field.tabs.map((tab) => (
                    <div key={tab.id} className="flex items-center space-x-2">
                        <Input value={tab.label} onChange={e => updateTabLabel(tab.id, e.target.value)} />
                        <button onClick={() => removeTab(tab.id)} className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-50" disabled={field.tabs.length <= 1}>
                            <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
            <Button onClick={addTab} variant="secondary" className="mt-3 w-full flex items-center justify-center space-x-2">
                <PlusIcon/>
                <span>Add Tab</span>
            </Button>
        </PropertyGroup>
    );
};

const ImageProperties = ({ field }: { field: ImageField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Image Options">
            <div>
                <Label htmlFor="src">Image URL</Label>
                <Input id="src" value={field.src} onChange={e => updateField(field.id, { src: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input id="alt" value={field.alt} onChange={e => updateField(field.id, { alt: e.target.value })} />
            </div>
        </PropertyGroup>
    );
};

const HtmlProperties = ({ field }: { field: HtmlField }) => {
    const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="HTML Options">
            <div>
                <Label htmlFor="html">HTML Code</Label>
                <Textarea id="html" value={field.html} onChange={e => updateField(field.id, { html: e.target.value })} rows={10} />
            </div>
        </PropertyGroup>
    );
};

const RepeaterProperties = ({ field }: { field: RepeaterField }) => {
     const { updateField } = useContext(FormBuilderContext);
    return (
        <PropertyGroup title="Repeater Options">
            <div>
                <Label htmlFor="addButtonLabel">"Add" Button Label</Label>
                <Input id="addButtonLabel" value={field.addButtonLabel} onChange={e => updateField(field.id, { addButtonLabel: e.target.value })} />
            </div>
        </PropertyGroup>
    );
}

const FieldSpecificProperties = ({ field }: { field: FormFieldInstance }) => (
    <>
        {field.type === FieldType.TextField && <TextFieldProperties field={field} />}
        {field.type === FieldType.TextareaField && <TextareaProperties field={field} />}
        {field.type === FieldType.SelectField && <SelectProperties field={field} />}
        {(field.type === FieldType.SelectField || field.type === FieldType.RadioGroupField) && <OptionsProperties field={field} />}
        {field.type === FieldType.FileUploadField && <FileUploadProperties field={field} />}
        {field.type === FieldType.RatingField && <RatingProperties field={field} />}
        {field.type === FieldType.CalculatedField && <CalculatedFieldProperties field={field} />}
        {field.type === FieldType.MatrixField && <MatrixProperties field={field} />}
        {field.type === FieldType.LookupField && <LookupProperties field={field} />}
        {field.type === FieldType.PaymentField && <PaymentProperties field={field} />}
        {field.type === FieldType.GroupField && <GroupProperties field={field} />}
        {field.type === FieldType.TabsField && <TabsProperties field={field} />}
        {field.type === FieldType.ImageField && <ImageProperties field={field} />}
        {field.type === FieldType.HtmlField && <HtmlProperties field={field} />}
        {field.type === FieldType.SliderField && <SliderProperties field={field} />}
        {field.type === FieldType.RepeaterField && <RepeaterProperties field={field} />}
    </>
);

const FormSettingsPanel = () => {
    const { fields, formSettings, setFormSettings } = useContext(FormBuilderContext);

    const allFields = useMemo(() => {
        const result: FormFieldInstance[] = [];
        const recurse = (items: FormFieldInstance[]) => {
            items.forEach(item => {
                result.push(item);
                if ('children' in item && Array.isArray(item.children)) recurse(item.children);
                if ('tabs' in item && Array.isArray(item.tabs)) item.tabs.forEach(t => recurse(t.children));
            })
        }
        recurse(fields);
        return result;
    }, [fields]);

    const addMapping = () => {
        const newMapping: UrlParameterMapping = { id: crypto.randomUUID(), paramName: '', targetFieldId: ''};
        setFormSettings({ ...formSettings, urlParameterMapping: [...formSettings.urlParameterMapping, newMapping] });
    };

    const updateMapping = (id: string, prop: keyof UrlParameterMapping, value: string) => {
        const newMappings = formSettings.urlParameterMapping.map(m => m.id === id ? { ...m, [prop]: value } : m);
        setFormSettings({ ...formSettings, urlParameterMapping: newMappings });
    };

    const removeMapping = (id: string) => {
        setFormSettings({ ...formSettings, urlParameterMapping: formSettings.urlParameterMapping.filter(m => m.id !== id) });
    }

    return (
         <aside className="w-80 bg-slate-900 p-6 overflow-y-auto border-l border-slate-800">
             <h2 className="text-lg font-bold text-slate-200 mb-6">Form Settings</h2>
             <div className="space-y-8">
                 <PropertyGroup title="Data Pre-Population">
                     <div className="p-3 bg-slate-850 rounded-md space-y-3">
                         <h4 className="text-sm font-semibold text-slate-300">URL Parameter Mapping</h4>
                         <p className="text-xs text-slate-400">Pre-fill fields from URL query strings.</p>
                         <div className="space-y-2">
                             {formSettings.urlParameterMapping.map(mapping => (
                                 <div key={mapping.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                     <Input placeholder="URL Param" value={mapping.paramName} onChange={e => updateMapping(mapping.id, 'paramName', e.target.value)} />
                                     <Select value={mapping.targetFieldId} onChange={e => updateMapping(mapping.id, 'targetFieldId', e.target.value)}>
                                         <option value="">Select Field...</option>
                                         {allFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                     </Select>
                                     <button onClick={() => removeMapping(mapping.id)} className="p-1 text-slate-400 hover:text-red-500"><TrashIcon/></button>
                                 </div>
                             ))}
                         </div>
                         <Button onClick={addMapping} variant="secondary" className="w-full text-xs">Add Mapping</Button>
                     </div>
                      <div className="p-3 bg-slate-850 rounded-md space-y-2 opacity-50 cursor-not-allowed">
                         <h4 className="text-sm font-semibold text-slate-300">User Profile Mapping</h4>
                         <p className="text-xs text-slate-400">Pre-fill fields from logged-in user profiles (coming soon).</p>
                     </div>
                 </PropertyGroup>
                  <PropertyGroup title="Data & Integrations">
                     <div className="p-3 bg-slate-850 rounded-md space-y-2 opacity-50 cursor-not-allowed">
                         <h4 className="text-sm font-semibold text-slate-300">Smart Field Mapping</h4>
                         <p className="text-xs text-slate-400">Map form data to external systems like Salesforce or HubSpot (coming soon).</p>
                     </div>
                 </PropertyGroup>
             </div>
        </aside>
    );
};


export const ConfigurationPanel = () => {
    const { selectedFieldId, fields } = useContext(FormBuilderContext);
    const [activeTab, setActiveTab] = useState('basic');

    const findField = (items: FormFieldInstance[], id: string | null): FormFieldInstance | undefined => {
        if (!id) return undefined;
        for (const item of items) {
            if (item.id === id) return item;
            if (item.type === FieldType.GroupField || item.type === FieldType.RepeaterField) {
                const found = findField(item.children, id);
                if (found) return found;
            }
            if (item.type === FieldType.TabsField) {
                 for (const tab of item.tabs) {
                    const found = findField(tab.children, id);
                    if (found) return found;
                 }
            }
             if (item.type === FieldType.ABTestField) {
                 const foundA = findField(item.variantA, id);
                 if (foundA) return foundA;
                 const foundB = findField(item.variantB, id);
                 if (foundB) return foundB;
            }
        }
    };

    const selectedField = findField(fields, selectedFieldId);

    if (!selectedFieldId || !selectedField) {
        return <FormSettingsPanel />;
    }
    
    const formElement = Object.values(FORM_ELEMENTS).find(el => {
        if (el.type === FieldType.TextField && selectedField.type === FieldType.TextField) {
            return el.subtype === selectedField.subtype;
        }
        return el.type === selectedField.type;
    });

    return (
        <aside className="w-80 bg-slate-900 p-6 overflow-y-auto border-l border-slate-800">
            <div>
                <div className="flex items-center space-x-3 mb-4">
                    <span className="text-indigo-400 text-2xl">{formElement?.icon}</span>
                    <div>
                        <h2 className="text-lg font-bold text-slate-200">{formElement?.label} Properties</h2>
                        <p className="text-xs text-slate-500 font-mono select-all">{selectedField.id}</p>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-800 mb-6">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('basic')} className={`${activeTab === 'basic' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                        Basic
                    </button>
                    <button onClick={() => setActiveTab('design')} className={`${activeTab === 'design' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                        Design
                    </button>
                    <button onClick={() => setActiveTab('logic')} className={`${activeTab === 'logic' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                        Advanced Logic
                    </button>
                </nav>
            </div>
            
            <div className="space-y-6">
                {activeTab === 'basic' && (
                    <>
                        <BasicProperties field={selectedField} />
                        <FieldSpecificProperties field={selectedField} />
                    </>
                )}
                {activeTab === 'design' && <DesignProperties field={selectedField} />}
                {activeTab === 'logic' && <LogicProperties field={selectedField} />}
            </div>
        </aside>
    );
};
