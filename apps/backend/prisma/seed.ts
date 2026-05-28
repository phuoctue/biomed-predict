import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/modules/auth/auth.service";

async function main() {
  const adminEmail = "admin@mediai.local";
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!exists) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await hashPassword("Admin@12345"),
        role: "ADMIN",
        name: "System Admin"
      }
    });
  }

  const drug = await prisma.drug.upsert({
    where: { code: "DRUG-AMOX-500" },
    update: {},
    create: {
      code: "DRUG-AMOX-500",
      name: "Amoxicillin 500mg",
      genericName: "Amoxicillin",
      category: "Antibiotic",
      indications: "Bacterial infections",
      contraindications: "Penicillin allergy"
    }
  });

  await prisma.patient.upsert({
    where: { code: "PT-0001" },
    update: {},
    create: {
      code: "PT-0001",
      fullName: "Nguyen Van A",
      dob: new Date("1988-05-01"),
      gender: "MALE",
      diagnosisSummary: "Upper respiratory infection",
      medications: {
        create: {
          drugName: drug.name,
          drugId: drug.id,
          dosage: "500mg",
          frequency: "Twice daily"
        }
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
