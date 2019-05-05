const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    password: String!
    createdAt: String!
    updatedAt: String!
    posts: [Post]
    comments: [Comment]
  }
  type Post {
    id: ID!
    userId: ID!
    title: String!
    description: String!
    createdAt: String!
    updatedAt: String!
    comments: [Comment]
  }
  type Comment {
    id: ID!
    userId: ID!
    postId: ID!
    comment: String!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    user(id: ID!): User
    post(id: ID!): Post
    comment(id: ID!): Comment
  }
`);
