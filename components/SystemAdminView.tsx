
import React, { useState } from 'react';
import { produce } from 'immer';
import { DbState, Organization, User, Role, Permission } from '../types';
import { Button, Input, Label, Select, Textarea } from './ui';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;

// --- Organizations Panel ---
const OrganizationsPanel = ({ db, setDb }: { db: DbState, setDb: React.Dispatch<React.SetStateAction<DbState>> }) => {
    const [newOrgName, setNewOrgName] = useState('');
    
    const addOrganization = () => {
        if (!newOrgName.trim()) return;
        const newOrg: Organization = { id: crypto.randomUUID(), name: newOrgName.trim() };
        setDb(produce(draft => {
            draft.organizations.push(newOrg);
        }));
        setNewOrgName('');
    };

    const deleteOrganization = (orgId: string) => {
        if (confirm('Are you sure? This will delete the organization and all its users and forms.')) {
            setDb(produce(draft => {
                draft.organizations = draft.organizations.filter(o => o.id !== orgId);
                draft.users = draft.users.filter(u => u.organizationId !== orgId);
                draft.forms = draft.forms.filter(f => f.organizationId !== orgId);
            }));
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Create New Organization</h3>
                <div className="flex space-x-2">
                    <Input placeholder="Organization Name" value={newOrgName} onChange={e => setNewOrgName(e.target.value)} />
                    <Button onClick={addOrganization}>Create</Button>
                </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">All Organizations</h3>
                <ul className="divide-y divide-slate-700">
                    {db.organizations.map(org => (
                        <li key={org.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-slate-200">{org.name}</p>
                                <p className="text-sm text-slate-400">{db.users.filter(u => u.organizationId === org.id).length} users</p>
                            </div>
                            <Button variant="danger" onClick={() => deleteOrganization(org.id)} disabled={org.id === 'org_system'}>Delete</Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// --- Users Panel ---
const UsersPanel = ({ db, setDb }: { db: DbState, setDb: React.Dispatch<React.SetStateAction<DbState>> }) => {
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [selectedOrgId, setSelectedOrgId] = useState(db.organizations[1]?.id || '');
    const [selectedRoleId, setSelectedRoleId] = useState(db.roles[1]?.id || '');
    
    const addUser = () => {
        if (!newUserEmail.trim() || !newUserPassword.trim() || !selectedOrgId || !selectedRoleId) return;
        const newUser: User = {
            id: crypto.randomUUID(),
            email: newUserEmail,
            passwordHash: newUserPassword,
            organizationId: selectedOrgId,
            roleId: selectedRoleId,
        };
        setDb(produce(draft => {
            draft.users.push(newUser);
        }));
        setNewUserEmail(''); setNewUserPassword('');
    };

    const deleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setDb(produce(draft => {
                draft.users = draft.users.filter(u => u.id !== userId);
            }));
        }
    };

    return (
         <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Create New User</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
                    <Input placeholder="Password" type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} />
                    <Select value={selectedOrgId} onChange={e => setSelectedOrgId(e.target.value)}>
                        {db.organizations.filter(o => o.id !== 'org_system').map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </Select>
                    <Select value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)}>
                        {db.roles.filter(r => r.id !== 'role_system_admin').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </Select>
                </div>
                 <Button onClick={addUser} className="mt-4">Add User</Button>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">All Users</h3>
                <ul className="divide-y divide-slate-700">
                     {db.users.map(user => {
                        const org = db.organizations.find(o => o.id === user.organizationId);
                        const role = db.roles.find(r => r.id === user.roleId);
                        return (
                            <li key={user.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-slate-200">{user.email}</p>
                                    <p className="text-sm text-slate-400">{org?.name} / {role?.name}</p>
                                </div>
                                <Button variant="danger" onClick={() => deleteUser(user.id)} disabled={user.email === 'admin@system.com'}>Delete</Button>
                            </li>
                        );
                     })}
                </ul>
            </div>
        </div>
    )
};

// --- Roles & Permissions Panel ---
const RolesPanel = ({ db, setDb }: { db: DbState, setDb: React.Dispatch<React.SetStateAction<DbState>> }) => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const updateRolePermissions = (perm: Permission, checked: boolean) => {
        if (!selectedRole) return;
        setDb(produce(draft => {
            const role = draft.roles.find(r => r.id === selectedRole.id);
            if (role) {
                if (checked) {
                    role.permissions.push(perm);
                } else {
                    role.permissions = role.permissions.filter(p => p !== perm);
                }
            }
        }));
        setSelectedRole(produce(selectedRole, draft => {
             if (checked) draft.permissions.push(perm);
             else draft.permissions = draft.permissions.filter(p => p !== perm);
        }))
    };
    
    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Role List */}
            <div className="col-span-1 bg-slate-800 p-4 rounded-lg">
                 <h3 className="font-semibold text-lg mb-4">Roles</h3>
                 <ul className="space-y-2">
                    {db.roles.map(role => (
                        <li key={role.id}>
                            <button 
                                onClick={() => setSelectedRole(role)}
                                className={`w-full text-left p-3 rounded-md ${selectedRole?.id === role.id ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                            >
                                <p className="font-semibold">{role.name}</p>
                                <p className="text-xs opacity-80">{role.description}</p>
                            </button>
                        </li>
                    ))}
                 </ul>
            </div>
            {/* Permissions */}
            <div className="col-span-2 bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Permissions</h3>
                {selectedRole ? (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-xl text-indigo-400">{selectedRole.name}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(Permission).map(perm => (
                                <label key={perm} className="flex items-center space-x-3 bg-slate-900 p-3 rounded-md">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 rounded bg-slate-800 border-slate-600 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedRole.permissions.includes(perm)}
                                        onChange={(e) => updateRolePermissions(perm, e.target.checked)}
                                        disabled={selectedRole.name === 'System Admin'}
                                    />
                                    <span className="text-sm font-mono">{perm}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400">Select a role to view its permissions.</p>
                )}
            </div>
        </div>
    )
};


export const SystemAdminView = ({ db, setDb, onExit }: { db: DbState, setDb: React.Dispatch<React.SetStateAction<DbState>>, onExit: () => void }) => {
    const [activeTab, setActiveTab] = useState<'orgs' | 'users' | 'roles'>('orgs');

    return (
        <div className="flex-1 p-8 bg-slate-950 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-100">Admin Dashboard</h2>
                    <Button onClick={onExit} variant="secondary">Back to My Forms</Button>
                </div>

                <div className="border-b border-slate-700 mb-6">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('orgs')} className={`${activeTab === 'orgs' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Organizations
                        </button>
                        <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Users
                        </button>
                        <button onClick={() => setActiveTab('roles')} className={`${activeTab === 'roles' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Roles & Permissions
                        </button>
                    </nav>
                </div>

                {activeTab === 'orgs' && <OrganizationsPanel db={db} setDb={setDb} />}
                {activeTab === 'users' && <UsersPanel db={db} setDb={setDb} />}
                {activeTab === 'roles' && <RolesPanel db={db} setDb={setDb} />}
            </div>
        </div>
    )
};
