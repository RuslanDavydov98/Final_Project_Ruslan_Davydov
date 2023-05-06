import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="dev-rjlwjzurb1lvdall.us.auth0.com"
    clientId="33quxF9PS8qfdHxCZsG8Z7k6eJvrlyzg"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
);


