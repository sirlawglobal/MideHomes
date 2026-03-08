import { useState } from 'react';
import { useMessageStore } from '../../store/useMessageStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useListingStore } from '../../store/useListingStore';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Mail, Reply, Trash2, CheckCircle2, User, Home, Phone, Calendar } from 'lucide-react';

export function Messages() {
    const { user } = useAuthStore();
    const { messages, markAsRead, deleteMessage } = useMessageStore();
    const { listings } = useListingStore();

    const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

    // Super Admins see all, regular Admins only see their own listings' messages
    const visibleMessages = messages.filter(msg =>
        user?.role === 'superadmin' || msg.agentId === user?.id
    );

    const selectedMsg = visibleMessages.find(m => m.id === selectedMsgId);
    const relatedProperty = selectedMsg ? listings.find(l => l.id === selectedMsg.listingId) : null;

    const handleSelectMessage = (id: string) => {
        setSelectedMsgId(id);
        markAsRead(id);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inbox</h1>
                <p className="text-slate-500 mt-1">
                    {user?.role === 'superadmin' ? 'Viewing all system inquiries.' : 'Manage inquiries for your properties.'}
                </p>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col md:flex-row">

                {/* Message List Sidebar */}
                <div className="w-full md:w-1/3 xl:w-1/4 border-r flex flex-col">
                    <div className="p-4 border-b bg-slate-50 font-semibold text-slate-700 flex justify-between items-center">
                        All Messages
                        <Badge variant="secondary">{visibleMessages.length}</Badge>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {visibleMessages.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Mail className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                                <p>No messages yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y relative">
                                {visibleMessages.map(msg => (
                                    <button
                                        key={msg.id}
                                        onClick={() => handleSelectMessage(msg.id)}
                                        className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedMsgId === msg.id ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-semibold ${!msg.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {msg.senderName}
                                            </span>
                                            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm line-clamp-2 ${!msg.read ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                                            {msg.message}
                                        </p>
                                        {!msg.read && (
                                            <div className="mt-2 text-xs font-bold text-blue-600 flex items-center">
                                                <div className="h-2 w-2 rounded-full bg-blue-600 mr-1.5" /> New
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail View */}
                <div className="flex-1 flex flex-col bg-slate-50/50">
                    {selectedMsg ? (
                        <>
                            {/* Message Header */}
                            <div className="p-6 border-b bg-white flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5 text-slate-400" /> {selectedMsg.senderName}
                                    </h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-slate-400" /> {selectedMsg.senderEmail}</div>
                                        {selectedMsg.senderPhone && (
                                            <div className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> {selectedMsg.senderPhone}</div>
                                        )}
                                        <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {new Date(selectedMsg.createdAt).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => markAsRead(selectedMsg.id)}>
                                        <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Read
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { deleteMessage(selectedMsg.id); setSelectedMsgId(null); }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Message Body Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {relatedProperty && (
                                    <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Home className="h-6 w-6" /></div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Inquiry About</p>
                                            <p className="font-medium text-slate-900">{relatedProperty.title}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white border rounded-xl p-6 shadow-sm">
                                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                                        {selectedMsg.message}
                                    </p>
                                </div>

                                <div className="bg-white border rounded-xl p-6 shadow-sm">
                                    <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <Reply className="h-4 w-4" /> Quick Reply
                                    </p>
                                    <Textarea placeholder={`Draft a reply to ${selectedMsg.senderName}...`} className="min-h-[120px] mb-3" />
                                    <div className="flex justify-end">
                                        <Button className="bg-blue-900 hover:bg-blue-800">Send Email Reply</Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                            <Mail className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium text-slate-500">Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
