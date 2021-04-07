import { intArg, queryType, stringArg } from '@nexus/schema'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findOne({
          where: {
            id: Number(userId),
          },
          include: {
            tweets: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            Following: {
              include: {
                UserFollowed: {
                  include: {
                    tweets: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
        })
      },
    })

    t.list.field('users', {
      type: 'User',
      args: {
        query: stringArg(),
      },
      resolve: (parent, { query }, ctx) => {
        if (query) {
          return ctx.prisma.user.findMany({
            where: {
              name: {
                contains: query!,
                mode: 'insensitive',
              },
            },
          })
        }
        return ctx.prisma.user.findMany(
          {
            where : {
              name : 'NOT EXISTS'
            }
          }
        )
      },
    })

    t.list.field('tweets', {
      type: 'Tweet',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.tweet.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        })
      },
    })

    t.field('tweet', {
      type: 'Tweet',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        const tweet = ctx.prisma.tweet.findOne({
          where: {
            id: Number(id),
          },
        })
        return tweet
      },
    })
    t.field('user', {
      type: 'User',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.user.findOne({
          where: {
            id: Number(id),
          },
          include: {
            tweets: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        })
      },
    })
    t.list.field('comments', {
      type: 'Comment',
      nullable: true,
      args: {
        commentId: intArg(),
      },
      resolve: (parent, { commentId: number }, ctx) => {
        return ctx.prisma.comment.findMany({
          where: {
            commentId: number,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      },
    })
  },
})
