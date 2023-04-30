const API_ROUTE = 'https://api.wishlists.link';

const createPostOptions = (body) => {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
};

export const postReq = (route, body) =>
  fetch(API_ROUTE.concat(route), createPostOptions(body));

export function TestUser() {
  console.log(user);
  return <h1>hello</h1>;
}
