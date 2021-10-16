export interface PostListModel {
    posts: PostModel[];
    total: number;
    offset: number;
}

export interface PostModel {
    id: number;
    title: string;
    summary?: string;
    created: number;

    prev: Pick<PostModel, 'id' | 'title'> | null;
    next: Pick<PostModel, 'id' | 'title'> | null;

    type: PostType;
    article?: ArticleModel;
}

export enum PostType {
    Article = 0,
}

export enum PostOrder {
    Created = 'created',
    CreatedReverse = '-created',
    Title = 'title',
    TitleReverse = '-title',
}

// extract the values to an array
export const postOrders = Object.values(PostOrder);

export interface ArticleModel {
    content: string;
}
