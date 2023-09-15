export const getGitHubUrl = () => {
  const rootURl = "https://github.com/login/oauth/authorize";

  const options = {
    client_id: "90f3da9bbe33d8461884",
    redirect_uri: "http://localhost:3000",
    scope: "user:email",
    // state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootURl}?${qs.toString()}`;
}
