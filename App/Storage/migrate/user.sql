CREATE TABLE IF NOT EXISTS `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `password` varchar(255) NOT NULL,
  `secret` mediumtext NULL,
  `lang` varchar(10) NULL,
  `roleId` int(11) NOT NULL,
  `data` longtext NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE(`email`),
  UNIQUE(`username`),
  KEY `idue` (`email`) USING BTREE,
  KEY `idun` (`username`) USING BTREE,
  KEY `idur` (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;