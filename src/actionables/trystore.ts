import { configureStore,createAction } from '@reduxjs/toolkit'
import nodesReducer from '../reducers/reducer';

const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    //comments: commentsReducer,
    //users: usersReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

/*connectionsList
{ uniqueId: that.nList[i].name, componentId: that.nList[i].componentId,  configuration:this.nList[i].configuration, connectedTo: targetIds, connectedFrom: that.nList[i].depth }

nList
{ name: cloneEl.id, componentId: item.componentId, depth: [],configuration:{} }

 this.nodenames = [
    //   { id: 'nginx', name: 'Nginx', icon: 'fa-file', vc: 0, stat: true },
    //   { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress', vc: 0, stat: true },
    //   { id: 'mysql', name: 'MySQL', icon: 'fa-database', vc: 0, stat: true },
    //   { id: 'locust', name: 'Locust', icon: 'fa', vc: 0, stat: false }
    // ]
*/