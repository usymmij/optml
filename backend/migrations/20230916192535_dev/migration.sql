-- CreateTable
CREATE TABLE "OptMLModelStats" (
    "id" STRING NOT NULL,
    "optml_id" STRING,
    "accuracy" FLOAT8,
    "loss" FLOAT8,

    CONSTRAINT "OptMLModelStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OptMLModelStats" ADD CONSTRAINT "OptMLModelStats_optml_id_fkey" FOREIGN KEY ("optml_id") REFERENCES "OptMLModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
