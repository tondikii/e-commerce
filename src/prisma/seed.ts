import {type Prisma} from "@prisma/client";

import {prisma, bcrypt} from "@/lib";

async function main() {
  // insert admin
  const usersAdmin: Prisma.UserCreateInput[] = [
    {
      email: "admin.sophie@gmail.com",
      name: "Admin Sophie",
      password: await bcrypt.hashPassword("password"),
      phoneNumber: "081511791945",
      role: "admin",
    },
    {
      email: "admin.richard@gmail.com",
      name: "Admin Richard",
      password: await bcrypt.hashPassword("password"),
      phoneNumber: "081511791946",
      role: "admin",
    },
  ];
  const resUsers = await prisma.user.createMany({
    data: usersAdmin,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resUsers.count} users.`);

  // insert sizes
  const sizes: Prisma.SizeCreateInput[] = [
    {
      name: "Small",
      code: "S",
    },
    {
      name: "Medium",
      code: "M",
    },
    {
      name: "Large",
      code: "L",
    },
    {
      name: "X-Large",
      code: "XL",
    },
  ];
  const resSizes = await prisma.size.createMany({
    data: sizes,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resSizes.count} sizes.`);

  const colors: Prisma.ColorCreateInput[] = [
    {
      name: "Light Green",
      hexCode: "#00C12B",
    },
    {
      name: "Red",
      hexCode: "#F50606",
    },
    {
      name: "Yellow",
      hexCode: "#F5DD06",
    },
    {
      name: "Orange",
      hexCode: "#F57906",
    },
    {
      name: "Light Blue",
      hexCode: "#06CAF5",
    },
    {name: "Dark Blue", hexCode: "#063AF5"},
    {
      name: "Purple",
      hexCode: "#7D06F5",
    },
    {
      name: "Pink",
      hexCode: "#F506A4",
    },
    {
      name: "White",
      hexCode: "#FFFFFF",
    },
    {
      name: "Black",
      hexCode: "#000000",
    },
  ];
  const resColors = await prisma.color.createMany({
    data: colors,
    skipDuplicates: true, // Optional: Skip duplicate entries based on unique constraints
  });
  console.log(`Inserted ${resColors.count} colors.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
