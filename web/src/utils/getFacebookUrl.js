export const getFacebookUrl = () => {
    const rootURl = "https://www.facebook.com/v12.0/dialog/oauth";

    // window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=email`;

    const options = {
        client_id: '6540110376044868',
        redirect_uri: "http://localhost:3000",
        scope: 'email', // Request profile and email access
        // scope: 'r_liteprofile r_emailaddress', // Request profile and email access
        // state: 'your_state', // Optional: add a state parameter for security
      };
        
    const qs = new URLSearchParams(options);
  
    return `${rootURl}?${qs.toString()}`;
    // return `https://www.facebook.com/v12.0/dialog/oauth?client_id=1014540076412017&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=email`;
}