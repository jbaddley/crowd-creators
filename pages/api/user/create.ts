// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { encrypt } from '../../../lib/crypto'

const prisma = new PrismaClient({ log: ['query', 'info'] })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const user = req.body
  const { hash, salt } = encrypt(user.password)
  const result = await prisma.user.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      login: {
        create: {
          username: user.email,
          password: hash,
          salt
        }
      }
    }
  })
  res.status(200).json({...result, status: 'SUCCESS'})
}
