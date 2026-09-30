-- AlterTable
ALTER TABLE "SymptomEntry" ADD COLUMN     "mergedSources" TEXT[] DEFAULT ARRAY[]::TEXT[];
