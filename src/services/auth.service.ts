import bcrypt from 'bcryptjs';
import { RegisterInput } from '../models/register-input.model';
import { PrismaClient } from '@prisma/client';
import HttpException from '../utils/http-exception';
import generateToken from '../utils/token';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

const checkUserUniqueness = async (email: string, username: string) => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },

    select: {
      id: true,
    },
  });

  const existingUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },

    select: {
      id: true,
    },
  });

  if (existingUserByUsername || existingUserByEmail) {
    throw new HttpException(422, {
      errors: {
        ...(existingUserByEmail ? { email: ['email has already taken'] } : {}),
        ...(existingUserByUsername
          ? { email: ['username has already taken'] }
          : {}),
      },
    });
  }
};

export const createUser = async (input: RegisterInput) => {
  const { email, username, password, image, bio } = input;

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkUserUniqueness(email, username);

  const hashPassword = await bcrypt.hash(password, 15);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashPassword,
      ...(image ? { image } : {}),
      ...(bio ? { bio } : {}),
    },

    select: {
      email: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  return {
    ...user,
  };
};

export const login = async (input: RegisterInput) => {
  const email = input.email.trim();
  const password = input.password.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },

    select: {
      email: true,
      username: true,
      password: true,
      bio: true,
      image: true,
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return {
        email: email,
        username: user.username,
        token: generateToken(user),
      };
    } else {
      throw new HttpException(403, { errors: `Invalid password` });
    }
  } else {
    throw new Error(`User Not found`);
  }
};

export const getCurrentUser = async (username: string) => {
  const user = (await prisma.user.findUnique({
    where: {
      username,
    },

    select: {
      id: true,
      username: true,
      email: true,
    },
  })) as User;

  return {
    ...user,
  };
};

export const updateUser = async (input: RegisterInput, user: string) => {
  const { email, username, password, image, bio } = input;

  const currentUser = await prisma.user.update({
    where: {
      username: user,
    },

    data: {
      ...(email ? { email } : {}),
      ...(username ? { username } : {}),
      ...(password ? { password } : {}),
      ...(image ? { image } : {}),
      ...(bio ? { bio } : {}),
    },

    select: {
      email: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  return {
    ...currentUser,
  };
};

export const deleteUser = async (id: number) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  if (!user) {
    throw new HttpException(404, 'User Not Found');
  } else {
    return 'User deleted successfully';
  }
};

export const findUserIdByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },

    select: {
      id: true,
    },
  });

  if (!user) {
    throw new HttpException(404, {});
  }

  return user;
};
