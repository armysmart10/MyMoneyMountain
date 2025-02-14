import { createAuth0Client } from "@auth0/auth0-spa-js";

const auth0Client = await createAuth0Client({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
});

export const login = async () => {
  await auth0Client.loginWithRedirect();
};

export const logout = () => {
  auth0Client.logout({ returnTo: window.location.origin });
};

export const getUser = async () => {
  return await auth0Client.getUser();
};

export const isAuthenticated = async () => {
  return await auth0Client.isAuthenticated();
};
