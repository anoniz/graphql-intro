const express = require('express');
const app = express();
const { graphqlHTTP } = require("express-graphql");


const authors = [
    { id: 1, name: "Harper Lee" },
    { id: 2, name: "George Orwell" },
    { id: 3, name: "Jane Austen" },
];

const books = [
    { id: 1, name: "To Kill a Mockingbird", authorId: 1 },
    { id: 2, name: "1984", authorId: 2 },
    { id: 3, name: "Pride and Prejudice", authorId: 3 },
    { id: 4, name: "The Great Gatsby", authorId: 2 },
    { id: 5, name: "The Catcher in the Rye", authorId: 1 },
    { id: 6, name: "Harry Potter and the Sorcerer's Stone", authorId: 3 },
    { id: 7, name: "The Hobbit", authorId: 3 },
    { id: 8, name: "Sense and Sensibility", authorId: 3 },
];


const { GraphQLSchema,
        GraphQLObjectType,
        GraphQLString,
        GraphQLList,
        GraphQLInt,
        GraphQLNonNull } = require('graphql')

const bookType = new GraphQLObjectType({
    name:'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type:GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: authorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

const authorType = new GraphQLObjectType({
    name:'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type:GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(bookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id);
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name:'Query',
    description: "Root Query",
    fields: () => ({
        book: {
            type: bookType,
            description: 'A Single Book',
            args : {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(bookType),
            description: 'List All of Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(authorType),
            description: 'List All of Authors',
            resolve: () => authors
        },
        author: {
            type: authorType,
            description: 'List All of Authors',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => authors.find(author => author.id === args.id)
        }, 
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutations",
    fields: () => ({
        addBook: {
            type: bookType,
            description: "Adds a book",
            args: {
                name: {type: GraphQLString},
                authorId: {type: GraphQLInt}
            },
            resolve: (parent,args) => {
                const book = {
                    id: books.length +1, name: args.name, authorId: args.authorId
                }
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: authorType,
            description: "Adds an Auther",
            args: {
                name: {type: GraphQLString},
            },
            resolve: (parent,args) => {
                const author = {
                    id: authors.length +1, name:args.name
                }
                authors.push(author);
                return author;
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    graphiql:true,
    schema:schema,
    
}));







app.listen(5000., () => console.log("server is listening on 5000"));




