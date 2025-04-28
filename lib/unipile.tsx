import { UnipileClient } from "unipile-node-sdk";

const unipile = new UnipileClient(
  `https://${process.env.UNIPILE_DSN}`,
  process.env.UNIPILE_API_TOKEN as string
);

export default unipile;
