import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './context/userContext';
import reportWebVitals from './reportWebVitals';
import Routings from './routings';
import './style/index.css';

const client = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Routings />
        </BrowserRouter>
      </QueryClientProvider>
    </UserContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
