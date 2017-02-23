
import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const schema = /* GraphQL */`

type Author {
  id: Int! # the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  posts: [Post] # the list of Posts by this author
}

type Post {
  id: Int!
  comment: String
  author: Author
  votes: Int
}

input NewPostInput {
  comment: String!
  authorId: Int!
}

# the schema allows the following query:
type Query {
  posts: [Post]
  author(id: Int!): Author
}

# this schema allows the following mutation:
type Mutation {
  upvotePost(postId: Int!): Post
  newAuthor(firstName: String!, lastName: String): Author
  newPost(post: NewPostInput!): Post
}

type Subscription {
  postUpvoted: Post
  newPost: Post
}

`;

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
