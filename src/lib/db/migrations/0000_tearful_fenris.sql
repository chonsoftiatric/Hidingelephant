CREATE TABLE `adminusers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` text NOT NULL,
	`type` enum('USER','ADMIN','DEV') DEFAULT 'USER',
	CONSTRAINT `adminusers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `canvas` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`projectId` bigint NOT NULL,
	`nodeSchema` json NOT NULL DEFAULT ('{"nodes":[],"edges":[]}'),
	CONSTRAINT `canvas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint NOT NULL,
	`credits` float DEFAULT 0,
	`earnedCredits` float DEFAULT 0,
	`remainingCredits` float DEFAULT 0,
	`creditsAllocated` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `credit_id` PRIMARY KEY(`id`),
	CONSTRAINT `credit_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `creditHistory` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`creditId` bigint NOT NULL,
	`credits` float DEFAULT 0,
	`creditsUsed` float DEFAULT 0,
	`plan` enum('FREE','PLUS','PRO','EARLY_BIRD') NOT NULL DEFAULT 'FREE',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `creditHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`promptId` bigint NOT NULL,
	`s3_image_key` text NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`isActive` boolean DEFAULT false,
	`isPrivate` boolean DEFAULT false,
	`generated_seed` bigint DEFAULT -1,
	`generated_prompt` text NOT NULL,
	`type` enum('logo','business_card') DEFAULT 'logo',
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT (''),
	`userId` bigint NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`api_name` text NOT NULL,
	`prompt` text NOT NULL,
	`negative_prompt` text NOT NULL,
	`seed` bigint NOT NULL,
	`sampler_index` text NOT NULL,
	`steps` bigint NOT NULL,
	`cfg_scale` bigint NOT NULL,
	`batch_size` smallint NOT NULL DEFAULT 1,
	`height` smallint NOT NULL DEFAULT 512,
	`width` smallint NOT NULL DEFAULT 512,
	`subProjectId` bigint NOT NULL,
	`s3_image_key` text,
	`type` enum('DEFAULT','MAGIC') DEFAULT 'DEFAULT',
	`script_args` json DEFAULT ('null'),
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subProjects` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT (''),
	`projectId` bigint NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `subProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp,
	`image` varchar(255),
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`stripePriceId` varchar(255),
	`stripeCurrentPeriodEnd` timestamp,
	`plan` enum('FREE','PLUS','PRO','EARLY_BIRD') NOT NULL DEFAULT 'FREE',
	`role` enum('USER','BETA_TESTER','MODERATOR','ADMIN') NOT NULL DEFAULT 'USER',
	`referralCode` varchar(255),
	`invitedById` bigint,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vectorize_images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`imageUrl` text NOT NULL,
	`imageId` bigint,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `vectorize_images_id` PRIMARY KEY(`id`)
);
