import { create } from 'zustand';
import axios from 'axios';

export interface Message {
    id: string;
    listingId: string;
    agentId: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    message: string;
    status: 'Read' | 'Unread';
    createdAt: string;
    listing?: {
        title: string;
    };
}

interface MessageState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    fetchMessages: (filters?: any) => Promise<void>;
    addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    updateMessageStatus: (id: string, status: 'Read' | 'Unread') => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    isLoading: false,
    error: null,

    fetchMessages: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/messages', { params: filters });
            set({ messages: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addMessage: async (messageData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/messages', messageData);
            set((state) => ({ 
                messages: [response.data, ...state.messages],
                isLoading: false 
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateMessageStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`/api/messages/${id}`, { status });
            set((state) => ({
                messages: state.messages.map((m) => (m.id === id ? { ...m, ...response.data } : m)),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteMessage: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/messages/${id}`);
            set((state) => ({
                messages: state.messages.filter((m) => m.id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
}));
