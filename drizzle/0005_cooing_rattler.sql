ALTER TABLE `races` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `races` MODIFY COLUMN `starttime` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `races` MODIFY COLUMN `endtime` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `races` MODIFY COLUMN `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `signups` MODIFY COLUMN `userid` int NOT NULL;--> statement-breakpoint
ALTER TABLE `signups` MODIFY COLUMN `raceid` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `firstname` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastname` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `birthday` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `gender` varchar(255) NOT NULL;