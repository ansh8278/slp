/** One-off YouTube sync from the CLI. Run: npm run sync */
import "dotenv/config";
import { syncChannel } from "../lib/youtube";

syncChannel().then((r) => {
  console.log(r);
  process.exit(r.ok ? 0 : 1);
});
