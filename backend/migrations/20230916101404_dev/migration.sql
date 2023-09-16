/*
  Warnings:

  - Made the column `flow_data` on table `OptMLModel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OptMLModel" ALTER COLUMN "flow_data" SET NOT NULL;
