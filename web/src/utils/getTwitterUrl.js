export const getTwitterUrl = () => {

    const rootURl = "https://twitter.com/i/oauth2/authorize";

    const options = {
        client_id: 'QkZMQXVNXzAxWlcyZ21WU0daZGo6MTpjaQ',
        redirect_uri: "http://localhost:3000",
        // scope: 'email,user_gender, user_birthday', // Request profile 
        response_type: "code",
        code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
        code_challenge_method: "plain",
        state: 'state',
        scope: ["users.read", "tweet.read", "follows.read", "follows.write"].join(" "), // add/remove scopes as needed
      };
  
    const qs = new URLSearchParams(options);
  
    return `${rootURl}?${qs.toString()}`;
  }
  
  