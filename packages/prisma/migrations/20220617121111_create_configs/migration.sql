-- CreateTable
CREATE TABLE "configs" (
    "id" BIGINT NOT NULL,
    "config" JSONB NOT NULL,
    "edited_at" INTEGER NOT NULL,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configs_id_key" ON "configs"("id");
