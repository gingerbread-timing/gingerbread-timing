ALTER TABLE `signups` ADD `paystatus` enum('paid','pending','unpaid') NOT NULL;--> statement-breakpoint
ALTER TABLE `signups` DROP COLUMN `sensorid`;--> statement-breakpoint
ALTER TABLE `signups` DROP COLUMN `paid`;