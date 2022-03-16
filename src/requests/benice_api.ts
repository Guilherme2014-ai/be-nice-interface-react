const env = "production";
const envs = {
  production: {
    baseUrl: "http://54.205.114.164:3006",
  },
  development: {
    baseUrl: "http://192.168.0.28:3006",
  },
};

const config = envs[env];

const requests = {
  users: {
    create: "/users/create",
    login: "/users/login",
    friends_invits_sent: "/users/friends/resquests/sents",
    friends_invits_received: "/users/friends/resquests/receiveds",
    friends_send_invite: (email) => `/users/friends/resquests/send/${email}`,
    friends_list: "/users/friends",
    session: "/session",
    profile_pictureEdit: "/users/profile/image",
    profile_textEdit: "/users/profile/text",
    send_compliment: (email) => `/users/compliments/create/${email}`,
    deny_invite: (email) => `/users/friends/resquests/deny/${email}`,
    accept_invite: (email) => `/users/friends/resquests/accept/${email}`,
    userByEmail: (email) => `/users/search/email/${email}`,
    email_authentication: (email, secret) =>
      `/users/email/verification/${email}/${secret}`,
  },
};

export { config, requests };
