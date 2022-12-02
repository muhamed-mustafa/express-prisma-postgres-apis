import slugify from 'slugify';
import { PrismaClient } from '@prisma/client';
import HttpException from '../utils/http-exception';
import { findUserIdByUsername } from './auth.service';

const prisma = new PrismaClient();

export const createArticle = async (article: any, username: string) => {
  const { title, description, body, tagList } = article;

  const user = await findUserIdByUsername(username);
  const slug = `${slugify(title)}-${user.id}`;

  const existingArticle = await prisma.article.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });

  if (existingArticle) {
    throw new HttpException(422, { errors: { title: ['must be unique'] } });
  }

  const createArticle = await prisma.article.create({
    data: {
      title,
      slug,
      description,
      body,
      tagList: {
        connectOrCreate: tagList.map((tag: string) => ({
          create: { name: tag },
          where: { name: tag },
        })),
      },
      author: {
        connect: {
          id: user.id,
        },
      },
    },

    include: {
      tagList: {
        select: {
          name: true,
        },
      },

      author: {
        select: {
          id: true,
          bio: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return createArticle;
};

export const getOneArticle = async (slug: any, username: string) => {
  const article = await prisma.article.findUnique({
    where: {
      slug,
    },

    include: {
      tagList: {
        select: {
          name: true,
        },
      },

      author: {
        select: {
          username: true,
          image: true,
        },
      },

      comments: {
        select: {
          id: true,
          body: true,
          author: {
            select: {
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return article;
};

export const addComment = async (
  body: string,
  slug: string,
  username: string
) => {
  const user = await findUserIdByUsername(username);

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },

    select: {
      id: true,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      body,
      article: {
        connect: {
          id: article!.id,
        },
      },

      author: {
        connect: {
          id: user.id,
        },
      },
    },

    include: {
      author: {
        select: {
          id: true,
          bio: true,
          username: true,
          image: true,
          followedBy: true,
        },
      },
    },
  });

  return comment;
};

export const deleteComment = async (id: number, username: string) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id,
      author: {
        username,
      },
    },
  });

  if (!comment) {
    throw new HttpException(404, 'Comment not found');
  }

  await prisma.comment.delete({
    where: {
      id,
    },
  });

  return null;
};

export const updateComment = async (
  body: string,
  id: number,
  username: string
) => {
  let comment = await prisma.comment.findFirst({
    where: {
      id,
      author: {
        username,
      },
    },
  });

  if (!comment) {
    throw new HttpException(404, 'Comment not found');
  }

  comment = await prisma.comment.update({
    data: {
      body,
    },
    where: {
      id,
    },
  });

  return comment;
};

export const favArticle = async (slug: string, username: string) => {
  const user = await findUserIdByUsername(username);

  const article = await prisma.article.update({
    where: {
      slug,
    },

    data: {
      favoritedBy: {
        connect: {
          id: user.id,
        },
      },
    },

    include: {
      tagList: {
        select: {
          name: true,
        },
      },

      author: {
        select: {
          id: true,
          bio: true,
          username: true,
          image: true,
        },
      },

      favoritedBy: {
        select: {
          id: true,
        },
      },

      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return article;
};

export const unFavArticle = async (slug: string, username: string) => {
  const user = await findUserIdByUsername(username);

  const article = await prisma.article.update({
    where: {
      slug,
    },

    data: {
      favoritedBy: {
        disconnect: {
          id: user.id,
        },
      },
    },

    include: {
      tagList: {
        select: {
          name: true,
        },
      },

      author: {
        select: {
          id: true,
          bio: true,
          username: true,
          image: true,
        },
      },

      favoritedBy: {
        select: {
          id: true,
        },
      },
    },
  });

  return article;
};
