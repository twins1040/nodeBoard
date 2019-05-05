# nodeBoard

install : npm install
run: node server.js

url: http://localhost:3000/index.html
graphQL url : http://localhost:3000/graphql
sample test query of graphQL:
{
  user(id:1) {
    id
    name
    posts {
      id
      title
    }
    comments {
      postId
      comment
    }
  }
  post(id:1) {
    title
    description
  	comments {
      comment
    }
  }
}
