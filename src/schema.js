import * as _ from 'underscore';

// This is the Dataset in our blog
import PostsList from './data/posts';
import AuthorsList from './data/authors';
import {CommentList, ReplyList} from './data/comments';

import {
  // These are the basic GraphQL types
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLEnumType,

  // This is used to create required fileds and arguments
  GraphQLNonNull,

  // This is the class we need to create the schema
  GraphQLSchema,
} from 'graphql';

/**
  DEFINE YOUR TYPES BELOW
**/

const Author = new GraphQLObjectType({
  name: 'Author',
  description: 'This represent an author',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: GraphQLString}
  })
});

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'This represent a Post',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: GraphQLString},
    author: {
      type: Author,
      resolve: function(post) {
        return _.find(AuthorsList, a => a._id == post.author);
      }
    }
  })
});

// This is the Root Query
const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: 'Root of the Blog Schema',
  fields: () => ({
    posts: {
      type: new GraphQLList(Post),
      resolve: function() {
        return PostsList;
      }
    },
    echo: {
      type: GraphQLString,
      description: 'Echo what you enter',
      args: {
        message: {type: GraphQLString}
      },
      resolve: function(source, {message}) {
        return {aa: 10};
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'BlogMutation',
  description: 'Mutation of our blog',
  fields: {
    createPost: {
      type: Post,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(source, args) {
        let post = Object.assign({}, args)
        post._id = `${Date.now()}::${Math.ceil(Math.random() * 9999999)}`
        post.author = "arunoda"

        // Add the Post to the data store
        PostsList.push(post)

        // return the new post.
        return post
      }
    }
  }
})

// This the Schema
const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default Schema;