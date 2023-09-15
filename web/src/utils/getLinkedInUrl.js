  export const getLinkedInUrl = () => {
    const rootURl = "https://www.linkedin.com/oauth/v2/authorization";

    const options = {
        response_type: 'code',
        client_id: '779we8d7z326v4',
        redirect_uri: "http://localhost:3000",
        scope: 'openid profile email', // Request profile and email access
        // scope: 'r_liteprofile r_emailaddress', // Request profile and email access
        // state: 'your_state', // Optional: add a state parameter for security
      };
  
    const qs = new URLSearchParams(options);
  
    return `${rootURl}?${qs.toString()}`;
  }
  
  