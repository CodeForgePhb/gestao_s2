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
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `matriculas_previstas` int DEFAULT NULL,
  `turno` varchar(50) DEFAULT NULL,
  `ch_total` int DEFAULT NULL,
  `modalidade` varchar(50) DEFAULT NULL,
  `financiamento` varchar(100) DEFAULT NULL,
  `localidade` varchar(255) DEFAULT NULL,
  `turma` varchar(100) DEFAULT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `docente` varchar(45) DEFAULT NULL,
  `cod` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `docente` (`nome`),
  KEY `cursos_concluidos_inicio` (`data_inicio`),
  KEY `cursos_concluidos_fim` (`data_fim`),
  KEY `doc_curso_idx` (`docente`),
  KEY `nome_idx` (`nome`),
  CONSTRAINT `doc_curso` FOREIGN KEY (`docente`) REFERENCES `docente` (`nome`),
  CONSTRAINT `chk_periodo` CHECK ((`data_inicio` <= `data_fim`))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Excel Avançado',30,'manhã',360,'presencial','gratuito','Parnaíba','A','2024-07-02','2024-12-02','miguel sousinha',45),(2,'Tecnico de Informática para Internet',25,'manhã',1200,'presencial','gratuito','Parnaíba','B','2024-07-02','2025-12-02',NULL,0),(3,'Administração',30,'manhã',800,'presencial','gratuito','Parnaíba','A','2024-12-02','2025-12-02',NULL,0),(4,'Administração',30,'manhã',800,'presencial','gratuito','Parnaíba','A','2023-12-02','2024-12-02',NULL,0),(5,'Técnico de Informática para Internet',25,'manhã',1200,'presencial','gratuito','Parnaíba','B','2023-09-04','2024-12-04',NULL,0),(6,'Técnico de Informática para Internet',25,'manhã',2200,'presencial','pago','Parnaíba','A','2023-01-01','2025-01-01',NULL,0);
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-20 11:02:07
