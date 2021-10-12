import { PostListModel, PostModel } from '../models/post';
import { api } from './request';

export async function getPosts(params: {
    page?: number;
    limit?: number;
    order?: string;
    types?: string;
}): Promise<PostListModel> {
    return api('posts', 'GET', params);
}

export async function getPost(id: string | number): Promise<PostModel> {
    return api(`posts/${id}`, 'GET');
}
