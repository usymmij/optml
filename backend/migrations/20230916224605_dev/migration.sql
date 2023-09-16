/*
  Warnings:

  - Added the required column `epoch` to the `OptMLModelStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptMLModelStats" ADD COLUMN     "epoch" INT4 NOT NULL;
