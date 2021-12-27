import { NextApiRequest, NextApiResponse } from "next";
import { request, gql } from "graphql-request";

const query = gql`
  query findUser($username: String!) {
    user(login: $username) {
      avatarUrl
      id
      name
      username: login
      bio
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repos: repositories(
        first: 4
        orderBy: { field: STARGAZERS, direction: DESC }
        ownerAffiliations: OWNER
      ) {
        totalCount
        nodes {
          name
          url
          stars: stargazerCount
        }
      }
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query;
  if (!username)
    return res.status(404).json({ message: "username is required" });

  const result = await request(
    "https://api.github.com/graphql",
    query,
    {
      username,
    },
    { authorization: `Bearer ${process.env.TOKEN}` }
  );

  return res.send(result);
}
