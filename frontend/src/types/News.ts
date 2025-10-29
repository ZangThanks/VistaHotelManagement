export interface NewsItem {
    newsId: string;
    title: string;
    subtitle: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    highlight: boolean;
}
export interface News {
    id?: string;
    newsId: string;
    title: string;
    subtitle: string;
    content: string;
    imageUrl: string;
    createdAt?: string;
    startDate?: string;
    endDate?: string;
    highlight: boolean;
}

