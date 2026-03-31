const DEFAULT_GOOGLE_WEB_CLIENT_ID =
  "1096965053624-rofq5l7e014rf61ovlbo41b4e3ikp542.apps.googleusercontent.com";

export const WEB_AUTH_PROVIDERS = {
  google: {
    webClientId:
      import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_WEB_CLIENT_ID,
  },
};

export const getGoogleWebClientId = () => WEB_AUTH_PROVIDERS.google.webClientId;
