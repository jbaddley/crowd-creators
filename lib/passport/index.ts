export * from "./local";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import passport from "passport";
import nextConnect from "next-connect";
import { getLocalStrategy } from "./local";
import { PrismaClient } from "@prisma/client";
import expressSession, { SessionOptions } from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { sessionUser } from "../session";

const setupPassport = () => {
  const prisma = new PrismaClient();

  passport.serializeUser(function (user: any, done) {
    process.nextTick(() => {
      done(null, user.id);
    });
  });

  passport.deserializeUser(async function (id: any, done) {
    process.nextTick(async () => {
      const user = await prisma.user.findFirst({
        where: {
          id: +id,
        },
      });
      done(null, user);
    });
  });

  passport.use(getLocalStrategy(prisma));

  const cookieOpts: SessionOptions = {
    secret: process.env.TOKEN_SECRET || "cat",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      ),
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  };

  return nextConnect()
    .use(expressSession(cookieOpts))
    .use(passport.initialize())
    .use(passport.session());
};

export default setupPassport();
