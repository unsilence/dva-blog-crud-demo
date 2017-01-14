import {fetchPosts} from '../services/posts';
import {storageTokenKey} from '../utils/constant';

export default {
    namespace: 'posts',
    state: {
        postsList: [],
        paging: {}
    },
    subscriptions: {
        setup: function ({history, dispatch}) {
            history.listen(location => {
                if (['/posts'].includes(location.pathname)) {
                    dispatch({
                        type: 'queryPosts',
                        payload: {
                            pageInfo: {
                                limit: 5,
                                page: 1
                            }
                        }
                    });
                }
            });
        }
    },
    effects: {
        queryPosts: function *({payload}, {call, put, select}) {
            const {pageInfo} = payload;
            const {data} = yield call(fetchPosts, {
                token: window.localStorage.getItem(storageTokenKey),
                pageInfo
            });

            if (data) {
                yield put({
                    type: 'queryPostsSuccess',
                    payload: data
                })
            }
        }
    },
    reducers: {
        queryPostsSuccess: function (state, {payload}) {
            const {paging, data} = payload;
            return {
                ...state,
                paging,
                postsList: data
            };
        }
    }
}
