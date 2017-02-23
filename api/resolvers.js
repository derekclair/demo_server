
import { find, filter } from 'lodash';

import { pubsub } from './subscriptions';

const authors = [
  { id: 1, firstName: 'Derek', lastName: 'Clair' },
  { id: 2, firstName: 'Jeffrey', lastName: 'Lebowski' },
];

const posts = [
  { id: 1, authorId: 1, comment: 'Apollo + GraphQL, easy peasy!', votes: 2 },
  { id: 2, authorId: 1, comment: 'GraphQL Rocks', votes: 3 },
  { id: 3, authorId: 2, comment: 'The dude abides', votes: 1 },
];

export default {
  Query: {
    posts() {
      return posts;
    },
    author(_, { id }) {
      return find(authors, { id });
    },
  },
  Mutation: {
    upvotePost(_, { postId }) {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      pubsub.publish('postUpvoted', post);
      return post;
    },
    newAuthor(_, { firstName, lastName }) {
      const newAuthor = {
        id: authors.length + 1,
        firstName,
        lastName,
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    newPost(_, { post }) {
      const newPost = {
        id: posts.length + 1,
        ...post,
        votes: 0,
      };
      posts.push(newPost);
      pubsub.publish('newPost', newPost);
      return newPost;
    },
  },
  Subscription: {
    postUpvoted(post) { return post; },
    newPost(post) { return post; },
  },
  Author: {
    posts(author) {
      return filter(posts, { authorId: author.id });
    },
  },
  Post: {
    author(post) {
      return find(authors, { id: post.authorId });
    },
  },
};
