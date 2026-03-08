import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
    id: string;
    listingId: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    message: string;
    agentId: string;
    createdAt: string;
    read: boolean;
}

interface MessageState {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => void;
    markAsRead: (id: string) => void;
    deleteMessage: (id: string) => void;
}

// Initial mock data simulating a message to Admin A (1) and Admin B (2)
export const MOCK_MESSAGES: Message[] = [
    {
        id: 'msg_1',
        listingId: '1',
        senderName: 'Alice Buyer',
        senderEmail: 'alice@example.com',
        senderPhone: '555-0100',
        message: 'I am highly interested in the luxury villa in Old Ikoyi. Can we schedule a viewing this weekend?',
        agentId: '1', // Belongs to John Admin
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
    },
    {
        id: 'msg_2',
        listingId: '2',
        senderName: 'Bob Renter',
        senderEmail: 'bob@example.com',
        message: 'Is the downtown penthouse still available? Do you allow pets?',
        agentId: '2', // Belongs to Sarah Jenkins
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
    }
];

export const useMessageStore = create<MessageState>()(
    persist(
        (set) => ({
            messages: MOCK_MESSAGES,
            addMessage: (msgData) => set((state) => ({
                messages: [{
                    id: Math.random().toString(36).substr(2, 9),
                    ...msgData,
                    createdAt: new Date().toISOString(),
                    read: false
                }, ...state.messages]
            })),
            markAsRead: (id) => set((state) => ({
                messages: state.messages.map(m => m.id === id ? { ...m, read: true } : m)
            })),
            deleteMessage: (id) => set((state) => ({
                messages: state.messages.filter(m => m.id !== id)
            })),
        }),
        {
            name: 'messages-storage',
        }
    )
);
