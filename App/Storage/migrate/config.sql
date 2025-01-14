CREATE TABLE IF NOT EXISTS `config` (
  `configId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `options` longtext NOT NULL,
  PRIMARY KEY (`configId`),
  KEY `idcon` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;