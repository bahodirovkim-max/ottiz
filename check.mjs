import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { phone: '+998946001160' }});
  console.log('USER:', user);
  if (!user) {
    console.log("Bu raqam egasi topilmadi.");
    return;
  }
  
  const asTenant = await prisma.rentAgreement.findMany({ 
    where: { tenantId: user.id }, 
    include: { property: true, payments: true } 
  });
  
  const asLandlord = await prisma.property.findMany({ 
    where: { landlordId: user.id }, 
    include: { agreements: { include: { payments: true, tenant: true } } } 
  });
  
  console.log('\n--- AS TENANT ---');
  console.log(JSON.stringify(asTenant, null, 2));
  
  console.log('\n--- AS LANDLORD ---');
  console.log(JSON.stringify(asLandlord, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
