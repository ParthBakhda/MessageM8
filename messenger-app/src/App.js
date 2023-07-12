import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useMutation, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation ($content: String!) {
    createMessage(content: $content) {
      id
      content
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_MESSAGES);
  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
    }
  }, [data]);

  const handleSendMessage = () => {
    createMessage({ variables: { content: newMessage } })
      .then(({ data }) => {
        setMessages((prevMessages) => [...prevMessages, data.createMessage]);
        setNewMessage('');
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Messenger App</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((message) => (
            <li key={message.id}>{message.content}</li>
          ))
        )}
      </ul>
    </div>
  );
}

function AppWrapper() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

export default AppWrapper;
