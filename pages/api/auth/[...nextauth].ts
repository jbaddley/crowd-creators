import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Email from "next-auth/providers/email"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Github({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    // Email({
    //     server: {
    //         host: '',
    //         port: '',
    //         auth: {
    //             user: '',
    //             pass: ''
    //         }
    //     },
    //     from: ''
    // })
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)