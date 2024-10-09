-- CreateEnum
CREATE TYPE "Location" AS ENUM ('BANGKOK', 'CHIANG_MAI', 'PATTAYA', 'PHUKET', 'HUA_HIN');

-- CreateTable
CREATE TABLE "ServiceProviderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "about" TEXT,
    "areaOfExpertise" TEXT[],
    "location" "Location" NOT NULL,
    "profileLogo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProviderProfile_userId_key" ON "ServiceProviderProfile"("userId");

-- AddForeignKey
ALTER TABLE "ServiceProviderProfile" ADD CONSTRAINT "ServiceProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
