
// --- Core Form Field Types ---

export enum FieldType {
  TextField = 'TextField',
  TextareaField = 'TextareaField',
  SelectField = 'SelectField',
  CheckboxField = 'CheckboxField',
  RadioGroupField = 'RadioGroupField',
  DatePickerField = 'DatePickerField',
  TimeField = 'TimeField',
  DateTimeField = 'DateTimeField',
  FileUploadField = 'FileUploadField',
  SignatureField = 'SignatureField',
  RatingField = 'RatingField',
  SliderField = 'SliderField',
  SectionBreak = 'SectionBreak',
  CalculatedField = 'CalculatedField',
  GroupField = 'GroupField',
  PageBreak = 'PageBreak',
  TabsField = 'TabsField',
  ImageField = 'ImageField',
  HtmlField = 'HtmlField',
  MatrixField = 'MatrixField',
  LookupField = 'LookupField',
  GeolocationField = 'GeolocationField',
  PaymentField = 'PaymentField',
  RepeaterField = 'RepeaterField',
  ProgressTrackerField = 'ProgressTrackerField',
  ABTestField = 'ABTestField',
}

export type FieldOption = { id: string; label: string; value: string; };

export interface BaseField {
  id: string;
  type: FieldType;
  label:string;
  defaultValue?: any;
  styles?: React.CSSProperties;
  logic?: LogicRule[];
  validation?: Validation;
  readOnly?: boolean;
}

export type TextFieldSubtype = 'text' | 'email' | 'phone' | 'url' | 'password';
export interface TextField extends BaseField { type: FieldType.TextField; subtype: TextFieldSubtype; placeholder: string; helperText: string; required: boolean; }
export interface TextareaField extends BaseField { type: FieldType.TextareaField; placeholder: string; helperText: string; required: boolean; rows: number; richText: boolean; }
export interface SelectField extends BaseField { type: FieldType.SelectField; placeholder: string; helperText: string; required: boolean; options: FieldOption[]; searchable: boolean; }
export interface CheckboxField extends BaseField { type: FieldType.CheckboxField; helperText: string; required: boolean; }
export interface RadioGroupField extends BaseField { type: FieldType.RadioGroupField; helperText: string; required: boolean; options: FieldOption[]; }
export interface DatePickerField extends BaseField { type: FieldType.DatePickerField; helperText: string; required: boolean; }
export interface TimeField extends BaseField { type: FieldType.TimeField; helperText: string; required: boolean; }
export interface DateTimeField extends BaseField { type: FieldType.DateTimeField; helperText: string; required: boolean; }
export interface FileUploadField extends BaseField { type: FieldType.FileUploadField; helperText: string; required: boolean; multiple: boolean; maxSizeInMb: number; allowedFileTypes: string; }
export interface SignatureField extends BaseField { type: FieldType.SignatureField; helperText: string; required: boolean; }
export interface RatingField extends BaseField { type: FieldType.RatingField; helperText: string; required: boolean; maxRating: number; }
export interface SliderField extends BaseField { type: FieldType.SliderField; helperText: string; required: boolean; min: number; max: number; step: number; }
export interface SectionBreak extends BaseField { type: FieldType.SectionBreak; description: string; }
export type CalculatedFieldFormat = 'none' | 'currency_usd';
export interface CalculatedField extends BaseField { type: FieldType.CalculatedField; formula: string; helperText: string; formatting: CalculatedFieldFormat; }
export interface GroupField extends BaseField { type: FieldType.GroupField; children: FormFieldInstance[]; columns: number; }
export interface PageBreak extends BaseField { type: FieldType.PageBreak; }
export type Tab = { id: string; label: string; children: FormFieldInstance[]; }
export interface TabsField extends BaseField { type: FieldType.TabsField; tabs: Tab[]; }
export interface ImageField extends BaseField { type: FieldType.ImageField; src: string; alt: string; width: string; height: string; }
export interface HtmlField extends BaseField { type: FieldType.HtmlField; html: string; }
export type MatrixRow = { id: string; label: string; }; export type MatrixCol = { id: string; label: string; }; export type MatrixCellInputType = 'text' | 'number' | 'checkbox' | 'radio';
export interface MatrixField extends BaseField { type: FieldType.MatrixField; rows: MatrixRow[]; columns: MatrixCol[]; cellInputType: MatrixCellInputType; helperText: string; }
export interface LookupField extends BaseField { type: FieldType.LookupField; placeholder: string; helperText: string; required: boolean; dataSourceUrl: string; }
export interface GeolocationField extends BaseField { type: FieldType.GeolocationField; helperText: string; required: boolean; }
export type PaymentGateway = 'stripe' | 'paypal';
export interface PaymentField extends BaseField { type: FieldType.PaymentField; gateway: PaymentGateway; helperText: string; }
export interface RepeaterField extends BaseField { type: FieldType.RepeaterField; children: FormFieldInstance[]; addButtonLabel: string; }
export interface ProgressTrackerField extends BaseField { type: FieldType.ProgressTrackerField; }
export interface ABTestField extends BaseField { type: FieldType.ABTestField; variantA: FormFieldInstance[]; variantB: FormFieldInstance[]; }

export type FormField = TextField | TextareaField | SelectField | CheckboxField | RadioGroupField | DatePickerField | TimeField | DateTimeField | FileUploadField | SignatureField | RatingField | SliderField | SectionBreak | CalculatedField | GroupField | PageBreak | TabsField | ImageField | HtmlField | MatrixField | LookupField | GeolocationField | PaymentField | RepeaterField | ProgressTrackerField | ABTestField;
export type FormFieldInstance = FormField;

// --- Logic Engine Types ---
export type LogicCondition = { id: string; sourceField: string; operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'not_contains' | 'is_empty' | 'is_not_empty'; value: any; };
export type ConditionGroup = { conjunction: 'and' | 'or'; conditions: LogicCondition[]; };
export type LogicAction = { id: string; actionType: 'show' | 'hide' | 'enable' | 'disable' | 'setValue'; targetFieldId: string; value?: any; };
export type LogicRule = { id: string; name: string; conditions: ConditionGroup; actions: LogicAction[]; }
export type Validation = { regex?: string; errorMessage?: string; };

// --- SaaS Platform Types ---

export enum Permission {
  // User Permissions
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_INVITE = 'user:invite',
  // Form Permissions
  FORM_CREATE = 'form:create',
  FORM_READ = 'form:read',
  FORM_UPDATE = 'form:update',
  FORM_DELETE = 'form:delete',
  FORM_SHARE = 'form:share',
  // Role Permissions
  ROLE_CREATE = 'role:create',
  ROLE_READ = 'role:read',
  ROLE_UPDATE = 'role:update',
  ROLE_DELETE = 'role:delete',
  // Organization Permissions
  ORGANIZATION_CREATE = 'organization:create',
  ORGANIZATION_READ = 'organization:read',
  ORGANIZATION_UPDATE = 'organization:update',
  ORGANIZATION_DELETE = 'organization:delete',
}

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export type User = {
  id: string;
  email: string;
  passwordHash: string; // In a real app, this would be a hash
  organizationId: string;
  roleId: string;
};

export type Organization = {
  id: string;
  name: string;
};

// --- Form & Settings Types ---

export type FormElement = {
    type: FieldType;
    construct: (id: string) => FormFieldInstance;
    label: string;
    icon: React.ReactNode;
    category: 'Basic' | 'Layout' | 'Advanced' | 'UX & Smart';
    subtype?: TextFieldSubtype;
};

export type FormElements = { [key: string]: FormElement; }

export type UrlParameterMapping = { id: string; paramName: string; targetFieldId: string; }

export type FormSettings = {
    name: string;
    urlParameterMapping: UrlParameterMapping[];
}

export type SavedForm = {
  id: string;
  organizationId: string;
  fields: FormFieldInstance[];
  formSettings: FormSettings;
  savedAt: string; // ISO string
};

export type DbState = {
  users: User[];
  organizations: Organization[];
  roles: Role[];
  forms: SavedForm[];
};
