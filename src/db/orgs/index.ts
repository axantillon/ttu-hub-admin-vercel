"use server";
import prisma from "../prisma";

export async function getAllOrgs() {
  const orgs = await prisma.org.findMany();

  return orgs;
}

export async function getOrgById(id: string) {
  const org = await prisma.org.findUnique({
    where: {
      id,
    },
  });

  return org;
}