// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Passport from "../../../lib/passport";

export default Passport.get(
  (req: NextApiRequest & { user: any, session: any }, res: NextApiResponse<any>) => {
    res.status(200).json(req.user);
  }
);
