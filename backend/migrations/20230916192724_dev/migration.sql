/*
  Warnings:

  - Added the required column `time` to the `OptMLModelStats` table without a default value. This is not possible if the table is not empty.
  - Made the column `accuracy` on table `OptMLModelStats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loss` on table `OptMLModelStats` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OptMLModelStats" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
ALTER TABLE "OptMLModelStats" ALTER COLUMN "accuracy" SET NOT NULL;
ALTER TABLE "OptMLModelStats" ALTER COLUMN "loss" SET NOT NULL;
