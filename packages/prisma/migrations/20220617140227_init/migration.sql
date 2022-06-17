-- CreateTable
CREATE TABLE `configs` (
    `id` BIGINT NOT NULL,
    `config` JSON NOT NULL,
    `edited_at` INTEGER NOT NULL,

    UNIQUE INDEX `configs_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allowed_guilds` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `owner_id` BIGINT NOT NULL,

    UNIQUE INDEX `allowed_guilds_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
