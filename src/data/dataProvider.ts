import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'react-admin';
import { getBinding, Binding } from '../bindings';
import { convertPostFromApi } from '../models/Post';

let binding: Binding | undefined;

export default async (type: string, resource: string, params: any) => {
    if (!binding) {
        binding = await getBinding();
    }

    console.log(type, resource, params);

    switch (type) {
        case GET_LIST: {
            const { page, perPage }: {page: number, perPage: number} = params.pagination;
            const { field, order }: {field: string, order: 'ASC' | 'DESC'} = params.sort;

            const apiPosts = await binding.query.posts({});
            if (apiPosts) {
                const posts = apiPosts.map(convertPostFromApi);
                console.log(posts);
                return {
                    data: posts,
                    total: posts.length
                }
            }
        }
        case GET_ONE: {
            switch (resource) {
                case 'posts': 
                const id: string = params.id;
                const apiPost = await binding.query.post({id: parseInt(id)})
                if (apiPost) {
                    const post = convertPostFromApi(apiPost);
                    console.log(post)
                    return {
                        data: post
                    }
                }
            }
        }
    }

    return {}
}