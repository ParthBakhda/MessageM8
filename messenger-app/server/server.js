const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { schema } = require('./schema.graphql');

const app = express();

mongoose.connect('mongodb://localhost:27017/messenger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Message = mongoose.model('Message', {
  content: String,
});

const rootValue = {
  messages: async () => {
    return await Message.find();
  },
  createMessage: async ({ content }) => {
    const message = new Message({ content });
    await message.save();
    return message;
  },
  deleteMessage: async ({ id }) => {
    return await Message.findByIdAndDelete(id);
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
