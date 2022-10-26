import { Strategy as LocalStrategy } from "passport-json";
import appConfig from "../appConfig";
import { validate } from "../crypto";
import { PrismaClient } from "@prisma/client";

export const getLocalStrategy = (prisma: PrismaClient) => new LocalStrategy(
  appConfig.local,
  async (email: string, password: string, done: (err: any, user: any) => void) => {
console.log('LOGGED IN', email)

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        login: true,
      },
    });
    if (!user) {
      return done({ message: "Incorrect email or password" }, {});
    }
    if (
      !validate(password, user.login?.password || "", user.login?.salt || "")
    ) {
      return done({ message: "Incorrect email or password" }, {});
    }
    return done(null, {
      ...user,
      status: "SUCCESS",
    });
  }
);
