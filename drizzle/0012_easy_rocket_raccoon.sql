CREATE TABLE `events` (
	`id` serial AUTO_INCREMENT,
	`raceid` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `signups` ADD `eventid` int NOT NULL;--> statement-breakpoint
ALTER TABLE `races` DROP COLUMN `price`;