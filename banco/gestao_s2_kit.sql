CREATE DATABASE  IF NOT EXISTS `gestao_s2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gestao_s2`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: gestao_s2
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `kit`
--

DROP TABLE IF EXISTS `kit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cod_kit` int DEFAULT NULL,
  `nome_kit` varchar(255) DEFAULT NULL,
  `saldo` int DEFAULT '0',
  `tipo` varchar(45) DEFAULT NULL,
  `curso` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `curso` (`curso`),
  KEY `cod_kit` (`cod_kit`) /*!80000 INVISIBLE */,
  KEY `nome_kit` (`nome_kit`),
  CONSTRAINT `kit_ibfk_1` FOREIGN KEY (`curso`) REFERENCES `curso` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kit`
--

LOCK TABLES `kit` WRITE;
/*!40000 ALTER TABLE `kit` DISABLE KEYS */;
INSERT INTO `kit` VALUES (1,101,'Kit de Ferramentas',10,NULL,'Excel Avançado'),(2,100,'Kit de Periféricos',10,NULL,NULL),(3,100,'Kit de Periféricos',15,NULL,'Administração'),(4,100,'Kit de Periféricos',15,NULL,'Excel Avançado'),(5,101,'Kit de Ferramentas',0,NULL,NULL),(6,101,'Kit de Ferramentas',0,NULL,NULL),(7,150,'kit_consumo_administracao',15,NULL,'Administração'),(8,4,'Kit de Periféricos',0,NULL,NULL),(9,4,'Kit de Periféricos',0,NULL,NULL),(10,4,'Kit de Periféricos',5,NULL,'Administração'),(11,4,'Kit de Periféricos',0,NULL,NULL),(12,NULL,NULL,0,NULL,NULL),(13,4,'Kit de Periféricos',0,NULL,NULL),(14,NULL,NULL,0,NULL,NULL),(15,4,'Kit de Periféricos',0,NULL,NULL),(16,120,'kit_consumo_administracao',0,NULL,NULL);
/*!40000 ALTER TABLE `kit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-24 10:57:59
