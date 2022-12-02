import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getTags = async (username?: string): Promise<string[]> => {
  const queries = [];

  if (username) {
    queries.push({
      username: {
        equals: username,
      },
    });
  }

  const tags = await prisma.tag.groupBy({
    where: {
      articles: {
        some: {},
        every: {
          author: {
            OR: queries,
          },
        },
      },
    },
    by: ['name'],
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
    take: 2,
  });

  return tags.map((tag) => tag.name);
};

export default getTags;
