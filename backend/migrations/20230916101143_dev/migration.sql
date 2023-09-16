-- CreateTable
CREATE TABLE "OptMLModel" (
    "id" STRING NOT NULL,
    "type" STRING,
    "flow_data" JSONB,

    CONSTRAINT "OptMLModel_pkey" PRIMARY KEY ("id")
);
