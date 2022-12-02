import { PrismaClient } from '@prisma/client';
import HttpException from '../utils/http-exception';
import { findUserIdByUsername } from './auth.service';

const prisma = new PrismaClient();

export const allUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
};

export const getProfile = async (username: string) => {
  const profile = await prisma.user.findUnique({
    where: {
      username,
    },

    include: {
      followedBy: true,
    },
  });

  if (!profile) {
    return new HttpException(404, 'Profile not found');
  }

  return profile;
};

export const followUser = async (usernamePayload: string, username: string) => {
  const user = await findUserIdByUsername(username);

  const profile = await prisma.user.update({
    where: {
      username: usernamePayload,
    },

    data: {
      followedBy: {
        connect: {
          id: user.id,
        },
      },
    },

    include: {
      followedBy: true,
    },
  });

  return profile;
};

export const unFollowUser = async (
  usernamePayload: string,
  username: string
) => {
  const user = await findUserIdByUsername(username);

  const profile = await prisma.user.update({
    where: {
      username: usernamePayload,
    },

    data: {
      followedBy: {
        disconnect: {
          id: user.id,
        },
      },
    },

    include: {
      followedBy: true,
    },
  });

  return profile;
};
