export interface Note {
    id: string
    title: string,
    contents: string,
    createdAt: Date,
    updatedAt: Date
    deletedAt: Date | null
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

export type CreateNoteRequest = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
export type UpdateNoteRequest = Partial<Pick<Note, 'title' | 'contents'>>
export interface QueryParams {
    page?: string | undefined,
    limit?: string | undefined,
    search?: string | undefined
}

export interface ISearchResult {
    matchingList: Note[],
    searchCount: number
}