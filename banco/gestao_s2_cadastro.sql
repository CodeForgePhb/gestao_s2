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
-- Table structure for table `cadastro`
--

DROP TABLE IF EXISTS `cadastro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cadastro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `reset_senha` varchar(255) DEFAULT NULL,
  `reset_senha_expires` datetime DEFAULT NULL,
  `setor` varchar(50) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `signature_image` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cadastro`
--

LOCK TABLES `cadastro` WRITE;
/*!40000 ALTER TABLE `cadastro` DISABLE KEYS */;
INSERT INTO `cadastro` VALUES (1,'Eulaine','eulaine@email.com','$2b$10$2nTXoWaMdykeqGCe3qRab.uxi9TJouV9azfDVn7POBrOizUIWW8Tq','2fe534a852ccf01f134d9a62de5f9dbb2b6ea970','2025-01-08 11:37:52','coordenação','/uploads/profile_1_1737113538783-121280183.png',NULL,NULL),(2,'turiano','turianosantos@gmail.com','$2b$10$OAb/mhzvkapPN9MNFRKqEO2K/0S7j6aQPIIqWdkyaQVVsKGdd0x9e',NULL,NULL,'gestão',NULL,NULL,NULL),(3,'Coordenação','cordenacao@senai.com','$2b$10$paXyQdW8f95wGA40db12BOB6XW8fj9ZzENks7NFxHiHSENG.lgAdi','d51f5a9a6727d10d9e8bea71d9b90f04ec5623d4','2025-01-08 11:20:01','coordenação',NULL,NULL,NULL),(4,'Daniel','danielbrtofc@gmail.com','$2b$10$nsh3l3/tLdtIb8AMyz6k9u33KMeDkJ.C0Xf02PZbWQaTpp7PutAmS',NULL,NULL,'docente',NULL,NULL,NULL),(5,'miguel','miguel@senai.br','$2b$10$xjGOoqp1apIxPWFTt4lgde8Rbs0HfYPPVzNDfMbKNU4/Myil5xtfC',NULL,NULL,'docente',NULL,NULL,NULL),(6,'elaine','elaine@email.com','$2b$10$kGovRcpKS5GqgDaSZ3.s.ukP0aQvshNN9MOLZnFJHmfpDC0meWT5C',NULL,NULL,'docente','/uploads/profile_6_1737372103647-972097115.jpg',NULL,NULL),(7,'Christian','joaochristian03@gmail.com','$2b$10$lmBdd9hEUvE6Pqv1FQQ6buYetR8HE0AX84BIhFOW0/GwkVqFROPjm','b241ddf57ed7d15e9a61725d92e84b535b5419ee','2025-01-08 11:34:40','coordenação',NULL,NULL,NULL),(8,'gestao','gestao@email.com','$2b$10$oryW3DJuijSmXgfBLOiQgurjJpQ80WNoKomJeKTLJKwK.BXqUpVJS',NULL,NULL,'gestão','/uploads/profile_8_1737371798246-312947686.png',NULL,NULL),(9,'turiano','turianosantos@hotmail.com','$2b$10$rDPl8VuYCdRnTQSPZqKS7.xLq0oTjpmcVdUirisdw4rhuxIVVg1EC',NULL,NULL,'gestão',NULL,NULL,NULL),(10,'daniel','gestao@gmail.com','$2b$10$2XtS2CqAogFKL1KLsYyhSe6DWvD7Rpxdw5QnszfT0L4yVlZMFYk4y',NULL,NULL,'gestão',NULL,NULL,NULL),(11,'daniel','coordenacao@gmail.com','$2b$10$BDTuMJ9U.mrw9N3/.XJ.fOcpCJ.NQ0Ax5fOj7Z2Z2XmaaAVta9Jb6',NULL,NULL,'coordenação',NULL,NULL,NULL),(12,'compras','compras@email.com','$2b$10$g7aHsw76Nuc5xX61UIRKteiNROusso1v9hOZk.Msjmns75gLi88iy',NULL,NULL,'setor de compras','/uploads/profile_12_1737372131355-142675011.png',NULL,NULL),(13,'miguel','teste@docente.br','$2b$10$FDeiSkXVCZw6BIliooBC/ehQ482VYn/f.MIz2zflOjW488iya4fl.',NULL,NULL,'docente',NULL,NULL,NULL),(14,'dan','setor@gmail.com','$2b$10$o4dKXq2pakYXXAHR4CpuUuvZz31HKgl721E3LSQZ9A75g5SSjLOvC',NULL,NULL,'setor de compras',NULL,NULL,NULL),(15,'Coordenação','coordenacao@senai.com','$2b$10$EexdbJuQoPufdsA8262QhuFew4ILzQUF1gqGFanPqKWmNbBail5TS',NULL,NULL,'coordenação',NULL,NULL,NULL),(16,'daniel','cordenacao@gmail.com','$2b$10$ky/kn81QEiV8GOs7FdU18uK4ScsVmFjKnOthFO/momnuvD3ro.MjW',NULL,NULL,'coordenação',NULL,NULL,NULL),(17,'Setor de Compras','setordecompras@senai.com','$2b$10$ok4dj8Ao7CCQWZlDYsSaq.l2lfaY6SIMi3b4kNubDbMR.3/M3Buli',NULL,NULL,'setor de compras',NULL,NULL,NULL),(18,'miguel','miguel@gestao.com','$2b$10$6ueu4d7eiD7xPHFsqdAy2OfHP7z477vFXPIz9e51yRyZQ6EzEee/q',NULL,NULL,'gestão','/uploads/profile_18_1737121663655-869210361.jpg',NULL,NULL),(19,'miguel sousa','miguel@docente.com','$2b$10$/7C8M6s.YVANjXNDdzh8uOkeQTwnJQkzMWbx28r92rVnNAtda7QE.',NULL,NULL,'docente',NULL,NULL,NULL),(20,NULL,'victor@teste1.com','$2b$10$kIZWMNKZLh7lgRc/ZU9wBu8NBssa7Q4jZiGy30H/nW37Ik210WeWy',NULL,NULL,'docente',NULL,NULL,NULL),(21,'Victor Freitas','victor@teste2.com','$2b$10$tkiGy3RmpMjhJevC.CaSV.WQ7Z3kTSe2Njo0L6iohYQ0aUASARADW',NULL,NULL,'docente',NULL,NULL,NULL),(22,'turiano3','turianoarromba@hotmail.com','$2b$10$dLE018rjHEMMVmY4fHP1juGfMf9Xb32quu10GjxbezePUutjw6hR.',NULL,NULL,'coordenação',NULL,NULL,NULL),(23,'turiano4','turiano4@hotmail.com','$2b$10$t9gsqnpCP4c7YTlyLeohZuOPkvJdPOEPU/rmeZgRllp5fErfTcpEu',NULL,NULL,'setor de compras',NULL,NULL,NULL),(24,'Docente','docente@senai.com','$2b$10$jhmdL241VYUj3QSaBJrVxOtOukOB6m4OUF9A62bsoOZfQsstK64sG',NULL,NULL,'docente',NULL,NULL,NULL),(25,'turiano5','gestao123@hotmail.com','$2b$10$F4p1QhFd5BDR9EG8EprfdOgqknQ3juNlSQiDGhqzitRgoQvHILToq',NULL,NULL,'gestão',NULL,NULL,NULL),(26,'turiano6','turi@hotmail.com','$2b$10$DyE5Dw9LD.Ic3vLiFyLcl.R3fOu8f.vrZ4AqF.AA7UxkCuPjefStu',NULL,NULL,'gestão',NULL,NULL,NULL),(27,'Daniel','cordenacao2@gmail.com','$2b$10$ZWZv7Er8JBvnHQf6L3UcT.jaAiYB9hfXFjpiQVo3rf4gLMB6qZZUm',NULL,NULL,'docente',NULL,NULL,NULL),(28,'turianodocente','docente@hotmail.com','$2b$10$uy2.rOhzGB30n780F/u0DOxB.3oWrf/XaAkmdfD/hIzUf0gqxScJ.',NULL,NULL,'docente',NULL,NULL,NULL),(29,'turianocompras','compras@hotmail.com','$2b$10$dNKMTtjVBGFFLbN2N0Vcm.x55nQGh.iZbAJGmCym156KDcLZlo0wy',NULL,NULL,'setor de compras',NULL,NULL,NULL),(30,'Serejo','serejo@gmail.com','$2b$10$TCCGc4NHo6z.5JBiQoRaCeUYiunkGkyZazfLmShsHob7GSDcnZszS',NULL,NULL,'docente',NULL,NULL,NULL),(31,'gestao2','gestao2@email.com','$2b$10$KDKHlCWGpJFD2XOaKVdo6eTcJlyFeItpnyMtOo8L4yGpTx5Wb4FUK',NULL,NULL,'gestão',NULL,NULL,NULL),(32,'Maria Elaine','maria@email.com','$2b$10$la5oBbccILqS4eax0DOnsuzkcUtxzb4QdzKncLixkRE1nsDfgM172',NULL,NULL,'setor de compras',NULL,NULL,NULL),(33,'Gestão','gestao@senai.com','$2b$10$naYNADKcDEK3SG/3nlEtt.XSmYGZT35qPBjXcDNc4jAf87vJMzayO',NULL,NULL,'gestão',NULL,NULL,NULL);
/*!40000 ALTER TABLE `cadastro` ENABLE KEYS */;
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
