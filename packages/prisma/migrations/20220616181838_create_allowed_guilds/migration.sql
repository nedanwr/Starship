-- CreateTable
CREATE TABLE "allowed_guilds" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "owner_id" BIGINT NOT NULL,

    CONSTRAINT "allowed_guilds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "allowed_guilds_id_key" ON "allowed_guilds"("id");
