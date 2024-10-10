import prisma from "./prisma";
import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Role } from "@prisma/client";

export async function createUser(email: string, password: string, firstName: string, lastName: string, role: Role) {
  const hashedPassword = await hash(password, 10);
  const verificationToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      verificationToken,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = await hash(newPassword, 10);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function createPasswordResetToken(userId: string) {
  const token = uuidv4();
  const expires = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expires,
    },
  });

  return token;
}

export async function findPasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function deletePasswordResetToken(token: string) {
  await prisma.passwordResetToken.delete({
    where: { token },
  });
}
