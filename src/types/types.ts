export interface Note {
    id: string
    title: string,
    contents: string,
    createdAt: Date,
    updatedAt: Date
}

export interface NotesMetaData {
    totalCount: number,
    totalPages: number,
    currentPage: number,
    limit: number,
    hasNext: boolean,
    hasPrev: boolean
}

export interface PaginatedResponse {
    notes: Note[],
    meta: NotesMetaData
}

export type CreateNoteRequest = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateNoteRequest = Partial<Pick<Note, 'title' | 'contents'>>
