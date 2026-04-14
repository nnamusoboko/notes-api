export interface Note {
    id: string
    title: string,
    contents: string,
    createdAt?: Date,
    updatedAt?: Date
}

export type CreateNoteRequest = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
export interface CreateNoteResponse extends Note {};
export type UpdateNoteRequest = Partial<Pick<Note, 'title' | 'contents'>>
