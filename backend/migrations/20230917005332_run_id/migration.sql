/*
  Warnings:

  - Added the required column `run_id` to the `OptMLModelStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptMLModelStats" ADD COLUMN     "run_id" STRING NOT NULL;
