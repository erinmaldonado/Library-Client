export interface AuthorDetailData {
    id: number;
    name: string;
    biography?: string;
    birthDate?: string;
    books: {
        id: number;
        title: string;
        genre?: string;
        price?: number;
    }[];
}