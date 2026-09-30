-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('PATIENT_ENTERED', 'DOCUMENT_EXTRACTION', 'AI_NATURAL_LANGUAGE', 'DEVICE_IMPORT', 'DOCTOR_ENTERED', 'DEMO');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PATIENT_CONFIRMED', 'NEEDS_DOCTOR_CONFIRMATION', 'REJECTED');

-- CreateEnum
CREATE TYPE "DiseaseType" AS ENUM ('CROHNS', 'ULCERATIVE_COLITIS', 'IBD_UNCLASSIFIED', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "MedicationRoute" AS ENUM ('ORAL', 'SUBCUTANEOUS', 'INTRAVENOUS', 'RECTAL', 'TOPICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "MedicationForm" AS ENUM ('TABLET', 'CAPSULE', 'INJECTION', 'INFUSION', 'ENEMA', 'SUPPOSITORY', 'CREAM', 'FOAM', 'LIQUID', 'OTHER');

-- CreateEnum
CREATE TYPE "MedicationEventStatus" AS ENUM ('TAKEN', 'SKIPPED', 'DELAYED', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('COLONOSCOPY', 'HISTOLOGY', 'MRI', 'CT', 'ULTRASOUND', 'BLOOD_TEST', 'CALPROTECTIN', 'PRESCRIPTION', 'SPECIALIST_REPORT', 'DISCHARGE_LETTER', 'SURGERY_REPORT', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'NEEDS_REVIEW', 'REVIEWED', 'FAILED');

-- CreateEnum
CREATE TYPE "ExtractionFieldStatus" AS ENUM ('PENDING', 'CONFIRMED', 'EDITED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProcedureType" AS ENUM ('COLONOSCOPY', 'ILEOCOLONOSCOPY', 'SIGMOIDOSCOPY', 'GASTROSCOPY', 'MRI', 'CT', 'ULTRASOUND', 'CAPSULE_ENDOSCOPY', 'SURGERY', 'OTHER');

-- CreateEnum
CREATE TYPE "ClinicalEventType" AS ENUM ('HOSPITALIZATION', 'URGENT_VISIT', 'EMERGENCY_ROOM', 'MAJOR_SYMPTOM_EVENT', 'DIAGNOSIS', 'SURGERY', 'STOMA_CREATED', 'STOMA_REVERSED', 'OTHER');

-- CreateEnum
CREATE TYPE "LocationCategory" AS ENUM ('BATHROOM', 'PHARMACY', 'HOSPITAL', 'IBD_CENTER', 'AIRPORT', 'STATION', 'HOTEL', 'IBD_FRIENDLY_PLACE');

-- CreateEnum
CREATE TYPE "LocationVerificationType" AS ENUM ('MAP_PROVIDER', 'USER_REPORTED', 'VIVIA_VERIFIED', 'PARTNER_VERIFIED');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('TERMS_OF_SERVICE', 'HEALTH_DATA_PROCESSING', 'AI_PROCESSING', 'DOCUMENT_AI_PROCESSING', 'LOCATION_ON_REQUEST', 'PRODUCT_ANALYTICS');

-- CreateEnum
CREATE TYPE "ConflictStatus" AS ENUM ('OPEN', 'RESOLVED_KEEP_EXISTING', 'RESOLVED_KEEP_NEW', 'NEEDS_DOCTOR_CONFIRMATION');

-- CreateEnum
CREATE TYPE "AiTask" AS ENUM ('DOCUMENT_EXTRACTION', 'NATURAL_LANGUAGE_LOG', 'VISIT_SUMMARY', 'QUESTION_GENERATION', 'EXPLAIN_TERM', 'TREND_EXPLANATION');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "birthYear" INTEGER,
    "hasStoma" BOOLEAN,
    "stomaType" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trackedSymptoms" TEXT[] DEFAULT ARRAY['bowelMovements', 'stoolConsistency', 'blood', 'urgency', 'pain', 'fatigue']::TEXT[],
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "disease" "DiseaseType" NOT NULL,
    "location" TEXT,
    "diagnosedAt" TIMESTAMP(3),
    "notes" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "dose" DOUBLE PRECISION,
    "unit" TEXT,
    "route" "MedicationRoute" NOT NULL,
    "form" "MedicationForm" NOT NULL,
    "intervalDays" INTEGER,
    "timesPerDay" INTEGER,
    "asNeeded" BOOLEAN NOT NULL DEFAULT false,
    "scheduleNote" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "prescribingDoctor" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationEvent" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "medicationId" UUID NOT NULL,
    "status" "MedicationEventStatus" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "sourceType" "SourceType" NOT NULL DEFAULT 'PATIENT_ENTERED',
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomEntry" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overall" INTEGER,
    "bowelMovements" INTEGER,
    "nightBowelMovements" INTEGER,
    "stoolConsistency" INTEGER,
    "liquidStools" INTEGER,
    "blood" INTEGER,
    "urgency" INTEGER,
    "pain" INTEGER,
    "fatigue" INTEGER,
    "bloating" INTEGER,
    "nausea" INTEGER,
    "appetite" INTEGER,
    "sleepQuality" INTEGER,
    "stress" INTEGER,
    "mood" INTEGER,
    "stomaOutput" TEXT,
    "extraintestinal" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "rawText" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SymptomEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BowelMovement" (
    "id" UUID NOT NULL,
    "symptomEntryId" UUID NOT NULL,
    "occurredAt" TIMESTAMP(3),
    "consistency" INTEGER,
    "blood" BOOLEAN,
    "urgency" BOOLEAN,

    CONSTRAINT "BowelMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodEntry" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "mealCategory" TEXT,
    "description" TEXT NOT NULL,
    "reaction" TEXT,
    "notes" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthMetric" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionnaireResponse" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "instrument" TEXT NOT NULL,
    "instrumentVersion" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION,
    "sourceType" "SourceType" NOT NULL DEFAULT 'PATIENT_ENTERED',
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionnaireResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "testCode" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "valueText" TEXT,
    "unit" TEXT,
    "referenceRange" TEXT,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedure" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "ProcedureType" NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL,
    "facility" TEXT,
    "findings" TEXT,
    "biopsyTaken" BOOLEAN,
    "notes" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalEvent" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "ClinicalEventType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "facility" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" UUID,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PATIENT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalDocument" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'UNKNOWN',
    "documentDate" TIMESTAMP(3),
    "status" "DocumentStatus" NOT NULL DEFAULT 'UPLOADED',
    "extractedText" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentExtraction" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "aiRunId" UUID,
    "classification" "DocumentType" NOT NULL,
    "classificationConfidence" DOUBLE PRECISION NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentExtraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedField" (
    "id" UUID NOT NULL,
    "extractionId" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "numericValue" DOUBLE PRECISION,
    "observedAt" TIMESTAMP(3),
    "sourceSnippet" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" "ExtractionFieldStatus" NOT NULL DEFAULT 'PENDING',
    "editedValue" TEXT,
    "appliedEntity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtractedField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthcareOrganization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "kind" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthcareOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "organizationId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorVisit" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "doctorId" UUID,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "patientConcerns" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitSummary" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "visitId" UUID,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "includedSections" TEXT[],
    "content" JSONB NOT NULL,
    "aiRunId" UUID,
    "patientConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareLink" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "summaryId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "lastAccessAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataConflict" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "entityType" TEXT NOT NULL,
    "existingId" UUID NOT NULL,
    "field" TEXT NOT NULL,
    "existingValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "newSourceType" "SourceType" NOT NULL,
    "newSourceId" UUID,
    "proposed" JSONB NOT NULL,
    "status" "ConflictStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataConflict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRun" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "task" "AiTask" NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputScope" JSONB NOT NULL,
    "sourceRefs" TEXT[],
    "output" JSONB NOT NULL,
    "safetyFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userConfirmed" BOOLEAN,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "LocationCategory" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "openingHours" TEXT,
    "open24h" BOOLEAN NOT NULL DEFAULT false,
    "hoursJson" JSONB,
    "accessible" BOOLEAN,
    "free" BOOLEAN,
    "source" TEXT NOT NULL,
    "externalId" TEXT,
    "verificationType" "LocationVerificationType" NOT NULL,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationFeature" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "feature" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reportedBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationReview" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "reliability" INTEGER NOT NULL,
    "cleanliness" INTEGER,
    "comment" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationReport" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "issue" TEXT NOT NULL,
    "details" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "ConsentType" NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletionRecord" (
    "id" UUID NOT NULL,
    "userIdHash" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "DeletionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyCard" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "showCondition" BOOLEAN NOT NULL DEFAULT true,
    "showMedications" BOOLEAN NOT NULL DEFAULT true,
    "showAllergies" BOOLEAN NOT NULL DEFAULT true,
    "showSurgeries" BOOLEAN NOT NULL DEFAULT true,
    "showStoma" BOOLEAN NOT NULL DEFAULT true,
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "allergies" TEXT,
    "surgeriesNote" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "extraNote" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_userId_key" ON "PatientProfile"("userId");

-- CreateIndex
CREATE INDEX "Diagnosis_userId_idx" ON "Diagnosis"("userId");

-- CreateIndex
CREATE INDEX "Medication_userId_idx" ON "Medication"("userId");

-- CreateIndex
CREATE INDEX "MedicationEvent_userId_occurredAt_idx" ON "MedicationEvent"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "SymptomEntry_userId_date_idx" ON "SymptomEntry"("userId", "date");

-- CreateIndex
CREATE INDEX "FoodEntry_userId_occurredAt_idx" ON "FoodEntry"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "HealthMetric_userId_kind_measuredAt_idx" ON "HealthMetric"("userId", "kind", "measuredAt");

-- CreateIndex
CREATE INDEX "QuestionnaireResponse_userId_instrument_completedAt_idx" ON "QuestionnaireResponse"("userId", "instrument", "completedAt");

-- CreateIndex
CREATE INDEX "LabResult_userId_testCode_takenAt_idx" ON "LabResult"("userId", "testCode", "takenAt");

-- CreateIndex
CREATE INDEX "Procedure_userId_performedAt_idx" ON "Procedure"("userId", "performedAt");

-- CreateIndex
CREATE INDEX "ClinicalEvent_userId_startedAt_idx" ON "ClinicalEvent"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "MedicalDocument_userId_createdAt_idx" ON "MedicalDocument"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Doctor_userId_idx" ON "Doctor"("userId");

-- CreateIndex
CREATE INDEX "DoctorVisit_userId_scheduledAt_idx" ON "DoctorVisit"("userId", "scheduledAt");

-- CreateIndex
CREATE INDEX "VisitSummary_userId_createdAt_idx" ON "VisitSummary"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_tokenHash_key" ON "ShareLink"("tokenHash");

-- CreateIndex
CREATE INDEX "ShareLink_userId_idx" ON "ShareLink"("userId");

-- CreateIndex
CREATE INDEX "DataConflict_userId_status_idx" ON "DataConflict"("userId", "status");

-- CreateIndex
CREATE INDEX "AiRun_userId_createdAt_idx" ON "AiRun"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Location_category_idx" ON "Location"("category");

-- CreateIndex
CREATE INDEX "Location_latitude_longitude_idx" ON "Location"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "LocationFeature_locationId_feature_key" ON "LocationFeature"("locationId", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "LocationReview_locationId_userId_key" ON "LocationReview"("locationId", "userId");

-- CreateIndex
CREATE INDEX "Consent_userId_type_createdAt_idx" ON "Consent"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_dueAt_idx" ON "Notification"("userId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyCard_userId_key" ON "EmergencyCard"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfile" ADD CONSTRAINT "PatientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationEvent" ADD CONSTRAINT "MedicationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationEvent" ADD CONSTRAINT "MedicationEvent_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomEntry" ADD CONSTRAINT "SymptomEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BowelMovement" ADD CONSTRAINT "BowelMovement_symptomEntryId_fkey" FOREIGN KEY ("symptomEntryId") REFERENCES "SymptomEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthMetric" ADD CONSTRAINT "HealthMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireResponse" ADD CONSTRAINT "QuestionnaireResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalEvent" ADD CONSTRAINT "ClinicalEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalDocument" ADD CONSTRAINT "MedicalDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentExtraction" ADD CONSTRAINT "DocumentExtraction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "MedicalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedField" ADD CONSTRAINT "ExtractedField_extractionId_fkey" FOREIGN KEY ("extractionId") REFERENCES "DocumentExtraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "HealthcareOrganization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorVisit" ADD CONSTRAINT "DoctorVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorVisit" ADD CONSTRAINT "DoctorVisit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitSummary" ADD CONSTRAINT "VisitSummary_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "DoctorVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "VisitSummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataConflict" ADD CONSTRAINT "DataConflict_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiRun" ADD CONSTRAINT "AiRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationFeature" ADD CONSTRAINT "LocationFeature_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationReview" ADD CONSTRAINT "LocationReview_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationReview" ADD CONSTRAINT "LocationReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationReport" ADD CONSTRAINT "LocationReport_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationReport" ADD CONSTRAINT "LocationReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyCard" ADD CONSTRAINT "EmergencyCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
