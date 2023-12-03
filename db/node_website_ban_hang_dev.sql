-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 03, 2023 lúc 06:42 PM
-- Phiên bản máy phục vụ: 10.4.25-MariaDB
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `node_website_ban_hang_dev`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `zip_code` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `addresses`
--

INSERT INTO `addresses` (`id`, `name`, `address`, `phone`, `city`, `zip_code`, `id_user`, `createdAt`, `updatedAt`) VALUES
(1, 'Ngô Văn Điệp', '80 đỗ quỳ - Hòa Xuân - Cẩm lệ', '0965840200', 'Đà nẵng', 50000, 1, '2023-10-29 15:15:25', '2023-10-29 15:15:25'),
(5, 'Điệp Phúc', 'xóm 9', '0965840200', 'H Kỳ Anh', 12345, 11, '2023-11-15 16:52:37', '2023-11-15 16:52:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `detail_orders`
--

CREATE TABLE `detail_orders` (
  `id` int(11) NOT NULL,
  `id_order` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `detail_orders`
--

INSERT INTO `detail_orders` (`id`, `id_order`, `quantity`, `id_product`, `createdAt`, `updatedAt`) VALUES
(4, 7, 2, 2, '2023-11-02 16:26:18', '2023-11-02 16:26:18'),
(5, 7, 2, 3, '2023-11-02 16:26:18', '2023-11-02 16:26:18'),
(6, 8, 2, 6, '2023-11-02 16:27:43', '2023-11-02 16:27:43'),
(7, 9, 1, 2, '2023-11-13 16:02:46', '2023-11-13 16:02:46'),
(8, 10, 1, 2, '2023-11-13 16:09:48', '2023-11-13 16:09:48'),
(9, 11, 1, 3, '2023-11-13 16:34:53', '2023-11-13 16:34:53'),
(10, 12, 1, 3, '2023-11-13 16:35:25', '2023-11-13 16:35:25'),
(11, 13, 2, 3, '2023-11-13 16:36:06', '2023-11-13 16:36:06'),
(12, 14, 2, 3, '2023-11-13 16:40:27', '2023-11-13 16:40:27'),
(13, 15, 2, 1, '2023-11-13 16:45:07', '2023-11-13 16:45:07'),
(14, 15, 4, 2, '2023-11-13 16:45:07', '2023-11-13 16:45:07'),
(15, 16, 1, 2, '2023-11-13 16:46:23', '2023-11-13 16:46:23'),
(16, 17, 1, 2, '2023-11-13 16:49:49', '2023-11-13 16:49:49'),
(17, 18, 1, 2, '2023-11-15 14:40:15', '2023-11-15 14:40:15'),
(18, 19, 1, 2, '2023-11-15 14:41:21', '2023-11-15 14:41:21'),
(19, 20, 3, 2, '2023-11-15 16:52:43', '2023-11-15 16:52:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `discounts`
--

CREATE TABLE `discounts` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `discounts`
--

INSERT INTO `discounts` (`id`, `code`, `discount`, `status`, `id_user`, `startDate`, `endDate`, `updatedAt`, `createdAt`) VALUES
(4, 'OIyoKVzz', 50, 1, 1, '2023-12-05', '2023-12-22', '2023-12-03 17:04:18', '2023-12-03 17:04:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `oders`
--

CREATE TABLE `oders` (
  `id` int(11) NOT NULL,
  `code` int(11) DEFAULT NULL,
  `payment` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_address` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `oders`
--

INSERT INTO `oders` (`id`, `code`, `payment`, `id_user`, `id_address`, `status`, `createdAt`, `updatedAt`) VALUES
(7, 634788, 2, 1, 1, 'Đã phê duyệt', '2023-11-02 16:26:18', '2023-11-06 14:56:12'),
(8, 869756, 1, 1, 1, 'Chờ phê duyệt', '2023-11-02 16:27:42', '2023-11-02 16:27:42'),
(9, 237313, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:02:46', '2023-11-13 16:02:46'),
(10, 610290, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:09:48', '2023-11-13 16:09:48'),
(11, 264808, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:34:53', '2023-11-13 16:34:53'),
(12, 956393, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:35:25', '2023-11-13 16:35:25'),
(13, 222561, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:36:06', '2023-11-13 16:36:06'),
(14, 979197, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:40:27', '2023-11-13 16:40:27'),
(15, 519091, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:45:07', '2023-11-13 16:45:07'),
(16, 843413, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:46:23', '2023-11-13 16:46:23'),
(17, 373923, 1, 1, 1, 'Chờ phê duyệt', '2023-11-13 16:49:49', '2023-11-13 16:49:49'),
(18, 222246, 1, 1, 1, 'Chờ phê duyệt', '2023-11-15 14:40:15', '2023-11-15 14:40:15'),
(19, 791098, 1, 1, 1, 'Chờ phê duyệt', '2023-11-15 14:41:21', '2023-11-15 14:41:21'),
(20, 838839, 1, 11, 5, 'Chờ phê duyệt', '2023-11-15 16:52:43', '2023-11-15 16:52:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `detail` text DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `image`, `price`, `detail`, `quantity`, `status`, `id_user`, `createdAt`, `updatedAt`) VALUES
(1, 'Đồng hồ 1', 'web/images/products/frederique-constant-business-timer-mens-watch-fc-270sw4p6.jpg', 50000, 'New', 12, 1, 1, '2023-10-29 14:17:22', '2023-10-30 13:04:16'),
(2, 'Đồng hồ 2', 'web/images/products/frederique-constant-classics-automatic-blue-dial-mens-watch-fc303nn5b6.jpg', 2000000, 'New', 34, 2, 1, '2023-10-29 14:17:46', '2023-10-30 13:04:24'),
(3, 'Đồng hồ 3', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 40000000, 'New', 11, 0, 1, '2023-10-29 14:18:11', '2023-10-30 13:04:30'),
(4, 'Okada Aoshi', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 897, 'How we spend our days is, of course, how we spend our lives. SQL Editor allows you to create and edit SQL text, prepare and execute selected queries. To start working with your server in Navicat, you should first establish a connection or several connections using the Connection window. Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored. To connect to a database or schema, simply double-click it in the pane. You will succeed because most people are lazy. The first step is as good as half over. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. Difficult circumstances serve as a textbook of life for people. I may not have gone where I intended to go, but I think I have ended up where I needed to be. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. A man is not old until regrets take the place of dreams. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. After comparing data, the window shows the number of records that will be inserted, updated or deleted in the target. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. Navicat 15 has added support for the system-wide dark mode. SQL Editor allows you to create and edit SQL text, prepare and execute selected queries. Instead of wondering when your next vacation is, maybe you should set up a life you don’t need to escape from. Navicat Cloud provides a cloud service for synchronizing connections, queries, model files and virtual group information from Navicat, other Navicat family members, different machines and different platforms. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. If it scares you, it might be a good thing to try. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. In other words, Navicat provides the ability for data in different databases and/or schemas to be kept up-to-date so that each repository contains the same information. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. All journeys have secret destinations of which the traveler is unaware. Actually it is just in an idea when feel oneself can achieve and cannot achieve. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. The On Startup feature allows you to control what tabs appear when you launch Navicat. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. Optimism is the one quality more associated with success and happiness than any other. In a Telnet session, all communications, including username and password, are transmitted in plain-text, allowing anyone to listen-in on your session and steal passwords and other information. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Navicat Monitor is a safe, simple and agentless remote server monitoring tool that is packed with powerful features to make your monitoring effective as possible. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. What you get by achieving your goals is not as important as what you become by achieving your goals. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. If the plan doesn’t work, change the plan, but never the goal. Success consists of going from failure to failure without loss of enthusiasm. The past has no power over the present moment. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and easily create, organize, access and share information in a secure and easy way. Navicat authorizes you to make connection to remote servers running on different platforms (i.e. Windows, macOS, Linux and UNIX), and supports PAM and GSSAPI authentication. In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. After comparing data, the window shows the number of records that will be inserted, updated or deleted in the target. SQL Editor allows you to create and edit SQL text, prepare and execute selected queries. All journeys have secret destinations of which the traveler is unaware.', 290, 1, 3, '2014-03-06 00:53:03', '2016-05-12 03:33:14'),
(5, 'Luo Ziyi', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 63, 'Navicat Data Modeler enables you to build high-quality conceptual, logical and physical data models for a wide variety of audiences. Navicat Data Modeler is a powerful and cost-effective database design tool which helps you build high-quality conceptual, logical and physical data models. To start working with your server in Navicat, you should first establish a connection or several connections using the Connection window. To successfully establish a new connection to local/remote server - no matter via SSL, SSH or HTTP, set the database login information in the General tab. All journeys have secret destinations of which the traveler is unaware. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. Anyone who has ever made anything of importance was disciplined. A man’s best friends are his ten fingers. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. A comfort zone is a beautiful place, but nothing ever grows there. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. A query is used to extract data from the database in a readable format according to the user\'s request. The first step is as good as half over. Navicat Cloud provides a cloud service for synchronizing connections, queries, model files and virtual group information from Navicat, other Navicat family members, different machines and different platforms. Secure SHell (SSH) is a program to log in into another computer over a network, execute commands on a remote server, and move files from one machine to another. Navicat is a multi-connections Database Administration tool allowing you to connect to MySQL, Oracle, PostgreSQL, SQLite, SQL Server, MariaDB and/or MongoDB databases, making database administration to multiple kinds of database so easy. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and easily create, organize, access and share information in a secure and easy way. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. Always keep your eyes open. Keep watching. Because whatever you see can inspire you. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. The Synchronize to Database function will give you a full picture of all database differences. To connect to a database or schema, simply double-click it in the pane. A comfort zone is a beautiful place, but nothing ever grows there. A comfort zone is a beautiful place, but nothing ever grows there. How we spend our days is, of course, how we spend our lives. If your Internet Service Provider (ISP) does not provide direct access to its server, Secure Tunneling Protocol (SSH) / HTTP is another solution. Sometimes you win, sometimes you learn. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. How we spend our days is, of course, how we spend our lives. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. Navicat is a multi-connections Database Administration tool allowing you to connect to MySQL, Oracle, PostgreSQL, SQLite, SQL Server, MariaDB and/or MongoDB databases, making database administration to multiple kinds of database so easy. All journeys have secret destinations of which the traveler is unaware. Always keep your eyes open. Keep watching. Because whatever you see can inspire you. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. Navicat allows you to transfer data from one database and/or schema to another with detailed analytical process. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. Remember that failure is an event, not a person. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. The Synchronize to Database function will give you a full picture of all database differences. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. How we spend our days is, of course, how we spend our lives. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. Navicat Data Modeler is a powerful and cost-effective database design tool which helps you build high-quality conceptual, logical and physical data models. I will greet this day with love in my heart. The past has no power over the present moment. Flexible settings enable you to set up a custom key for comparison and synchronization. To connect to a database or schema, simply double-click it in the pane. If you wait, all that happens is you get older. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. If opportunity doesn’t knock, build a door. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. Remember that failure is an event, not a person. Anyone who has ever made anything of importance was disciplined. Anyone who has never made a mistake has never tried anything new. It wasn’t raining when Noah built the ark. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. I may not have gone where I intended to go, but I think I have ended up where I needed to be. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. What you get by achieving your goals is not as important as what you become by achieving your goals. Navicat Data Modeler enables you to build high-quality conceptual, logical and physical data models for a wide variety of audiences. I may not have gone where I intended to go, but I think I have ended up where I needed to be. You cannot save people, you can just love them. In the middle of winter I at last discovered that there was in me an invincible summer.', 621, 2, 3, '2016-04-16 03:18:52', '2010-05-19 01:00:22'),
(6, 'Liu Xiuying', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 604, 'Sometimes you win, sometimes you learn. Navicat allows you to transfer data from one database and/or schema to another with detailed analytical process. Sometimes you win, sometimes you learn. Navicat Cloud provides a cloud service for synchronizing connections, queries, model files and virtual group information from Navicat, other Navicat family members, different machines and different platforms. Genius is an infinite capacity for taking pains. The On Startup feature allows you to control what tabs appear when you launch Navicat. A query is used to extract data from the database in a readable format according to the user\'s request.', 338, 0, 3, '2018-01-08 10:41:06', '2000-05-18 19:12:17'),
(7, 'Shi Xiuying', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 525, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you. Secure SHell (SSH) is a program to log in into another computer over a network, execute commands on a remote server, and move files from one machine to another. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. Typically, it is employed as an encrypted version of Telnet. It wasn’t raining when Noah built the ark. Creativity is intelligence having fun. A man is not old until regrets take the place of dreams. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. Navicat Monitor is a safe, simple and agentless remote server monitoring tool that is packed with powerful features to make your monitoring effective as possible. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Navicat Monitor is a safe, simple and agentless remote server monitoring tool that is packed with powerful features to make your monitoring effective as possible. If it scares you, it might be a good thing to try. Success consists of going from failure to failure without loss of enthusiasm. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. If opportunity doesn’t knock, build a door. If you wait, all that happens is you get older. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. Always keep your eyes open. Keep watching. Because whatever you see can inspire you. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. Always keep your eyes open. Keep watching. Because whatever you see can inspire you. How we spend our days is, of course, how we spend our lives. Always keep your eyes open. Keep watching. Because whatever you see can inspire you. The past has no power over the present moment. The reason why a great man is great is that he resolves to be a great man. I may not have gone where I intended to go, but I think I have ended up where I needed to be. Optimism is the one quality more associated with success and happiness than any other. Actually it is just in an idea when feel oneself can achieve and cannot achieve. Champions keep playing until they get it right. The On Startup feature allows you to control what tabs appear when you launch Navicat. A man is not old until regrets take the place of dreams. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. Instead of wondering when your next vacation is, maybe you should set up a life you don’t need to escape from. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections. If the plan doesn’t work, change the plan, but never the goal. Difficult circumstances serve as a textbook of life for people. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. You must be the change you wish to see in the world. The first step is as good as half over. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. To start working with your server in Navicat, you should first establish a connection or several connections using the Connection window. I will greet this day with love in my heart. I destroy my enemies when I make them my friends. SQL Editor allows you to create and edit SQL text, prepare and execute selected queries. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. Navicat allows you to transfer data from one database and/or schema to another with detailed analytical process. Always keep your eyes open. Keep watching. Because whatever you see can inspire you. Secure SHell (SSH) is a program to log in into another computer over a network, execute commands on a remote server, and move files from one machine to another. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. Flexible settings enable you to set up a custom key for comparison and synchronization. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. Secure SHell (SSH) is a program to log in into another computer over a network, execute commands on a remote server, and move files from one machine to another. The reason why a great man is great is that he resolves to be a great man. Navicat Monitor requires a repository to store alerts and metrics for historical analysis. Flexible settings enable you to set up a custom key for comparison and synchronization. You will succeed because most people are lazy.', 386, 1, 2, '2020-08-05 09:43:57', '2012-06-13 19:32:16'),
(8, 'Tang Chiu Wai', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 324, 'In other words, Navicat provides the ability for data in different databases and/or schemas to be kept up-to-date so that each repository contains the same information. A comfort zone is a beautiful place, but nothing ever grows there. Secure Sockets Layer(SSL) is a protocol for transmitting private documents via the Internet. How we spend our days is, of course, how we spend our lives. The On Startup feature allows you to control what tabs appear when you launch Navicat. If it scares you, it might be a good thing to try. The Main Window consists of several toolbars and panes for you to work on connections, database objects and advanced tools. Difficult circumstances serve as a textbook of life for people. I destroy my enemies when I make them my friends. There is no way to happiness. Happiness is the way. After comparing data, the window shows the number of records that will be inserted, updated or deleted in the target. Navicat Data Modeler enables you to build high-quality conceptual, logical and physical data models for a wide variety of audiences. SQL Editor allows you to create and edit SQL text, prepare and execute selected queries. I may not have gone where I intended to go, but I think I have ended up where I needed to be. SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s shell without compromising security. SQL Editor allows you to create and edit SQL text, prepare and execute selected queries. The On Startup feature allows you to control what tabs appear when you launch Navicat. All journeys have secret destinations of which the traveler is unaware. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. Success consists of going from failure to failure without loss of enthusiasm. If it scares you, it might be a good thing to try. You cannot save people, you can just love them. Navicat is a multi-connections Database Administration tool allowing you to connect to MySQL, Oracle, PostgreSQL, SQLite, SQL Server, MariaDB and/or MongoDB databases, making database administration to multiple kinds of database so easy. Genius is an infinite capacity for taking pains. Sometimes you win, sometimes you learn. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. Actually it is just in an idea when feel oneself can achieve and cannot achieve. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. You will succeed because most people are lazy. Sometimes you win, sometimes you learn. Navicat 15 has added support for the system-wide dark mode. Anyone who has ever made anything of importance was disciplined. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Instead of wondering when your next vacation is, maybe you should set up a life you don’t need to escape from. I destroy my enemies when I make them my friends. Instead of wondering when your next vacation is, maybe you should set up a life you don’t need to escape from. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. Sometimes you win, sometimes you learn. Champions keep playing until they get it right. The past has no power over the present moment. You can select any connections, objects or projects, and then select the corresponding buttons on the Information Pane. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections.', 412, 2, 1, '2014-01-09 00:26:39', '2007-02-16 04:03:33'),
(9, 'Hasegawa Mio', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 338, 'Remember that failure is an event, not a person. The Synchronize to Database function will give you a full picture of all database differences.', 54, 0, 1, '2023-04-26 21:06:33', '2006-08-11 11:43:48'),
(10, 'Sato Yuito', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 123, 'In the middle of winter I at last discovered that there was in me an invincible summer. A comfort zone is a beautiful place, but nothing ever grows there. Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. To connect to a database or schema, simply double-click it in the pane. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. I destroy my enemies when I make them my friends. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. To open a query using an external editor, control-click it and select Open with External Editor. You can set the file path of an external editor in Preferences. All the Navicat Cloud objects are located under different projects. You can share the project to other Navicat Cloud accounts for collaboration. To connect to a database or schema, simply double-click it in the pane. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Remember that failure is an event, not a person. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. The Synchronize to Database function will give you a full picture of all database differences. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. The first step is as good as half over. It provides strong authentication and secure encrypted communications between two hosts, known as SSH Port Forwarding (Tunneling), over an insecure network. Champions keep playing until they get it right. Navicat allows you to transfer data from one database and/or schema to another with detailed analytical process. The On Startup feature allows you to control what tabs appear when you launch Navicat. A man is not old until regrets take the place of dreams. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. If it scares you, it might be a good thing to try. Navicat Data Modeler is a powerful and cost-effective database design tool which helps you build high-quality conceptual, logical and physical data models. Navicat Monitor is a safe, simple and agentless remote server monitoring tool that is packed with powerful features to make your monitoring effective as possible. Difficult circumstances serve as a textbook of life for people. With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and easily create, organize, access and share information in a secure and easy way. Remember that failure is an event, not a person. I destroy my enemies when I make them my friends. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. To successfully establish a new connection to local/remote server - no matter via SSL, SSH or HTTP, set the database login information in the General tab. It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud. Features in Navicat are sophisticated enough to provide professional developers for all their specific needs, yet easy to learn for users who are new to database server. A man is not old until regrets take the place of dreams. You must be the change you wish to see in the world. Navicat provides powerful tools for working with queries: Query Editor for editing the query text directly, and Query Builder, Find Builder or Aggregate Builder for building queries visually. Always keep your eyes open. Keep watching. Because whatever you see can inspire you. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud.', 997, 0, 4, '2015-08-18 01:56:16', '2012-02-06 23:27:21'),
(11, 'Song Anqi', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 809, 'The Synchronize to Database function will give you a full picture of all database differences. Anyone who has ever made anything of importance was disciplined. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. Creativity is intelligence having fun. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. In the middle of winter I at last discovered that there was in me an invincible summer. Navicat Data Modeler enables you to build high-quality conceptual, logical and physical data models for a wide variety of audiences. There is no way to happiness. Happiness is the way. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. A man’s best friends are his ten fingers. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. You cannot save people, you can just love them. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. It collects process metrics such as CPU load, RAM usage, and a variety of other resources over SSH/SNMP. To start working with your server in Navicat, you should first establish a connection or several connections using the Connection window. How we spend our days is, of course, how we spend our lives. In the middle of winter I at last discovered that there was in me an invincible summer. Navicat is a multi-connections Database Administration tool allowing you to connect to MySQL, Oracle, PostgreSQL, SQLite, SQL Server, MariaDB and/or MongoDB databases, making database administration to multiple kinds of database so easy. Actually it is just in an idea when feel oneself can achieve and cannot achieve.', 503, 0, 2, '2008-09-17 22:01:29', '2013-10-16 19:28:09'),
(12, 'Gao Lan', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 451, 'Actually it is just in an idea when feel oneself can achieve and cannot achieve. The past has no power over the present moment. Navicat Data Modeler is a powerful and cost-effective database design tool which helps you build high-quality conceptual, logical and physical data models. Actually it is just in an idea when feel oneself can achieve and cannot achieve. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections.', 304, 0, 2, '2001-12-22 06:30:11', '2013-08-19 03:34:43'),
(13, 'Chen Xiuying', 'web/images/products/frederique-constant-quartz-silver-dial-mens-watch-fc-235m4s4_1.jpg', 659, 'Navicat 15 has added support for the system-wide dark mode. To successfully establish a new connection to local/remote server - no matter via SSL or SSH, set the database login information in the General tab. SQL Editor allows you to create and edit SQL text, prepare and execute selected queries. In the middle of winter I at last discovered that there was in me an invincible summer. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. Navicat 15 has added support for the system-wide dark mode. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. The On Startup feature allows you to control what tabs appear when you launch Navicat. If your Internet Service Provider (ISP) does not provide direct access to its server, Secure Tunneling Protocol (SSH) / HTTP is another solution. The reason why a great man is great is that he resolves to be a great man. Difficult circumstances serve as a textbook of life for people. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. Anyone who has never made a mistake has never tried anything new. It is used while your ISPs do not allow direct connections, but allows establishing HTTP connections. If you wait, all that happens is you get older. To connect to a database or schema, simply double-click it in the pane. Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud databases like Amazon RDS, Amazon Aurora, Oracle Cloud, Google Cloud and Microsoft Azure. After comparing data, the window shows the number of records that will be inserted, updated or deleted in the target. The On Startup feature allows you to control what tabs appear when you launch Navicat. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. After logged in the Navicat Cloud feature, the Navigation pane will be divided into Navicat Cloud and My Connections sections. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. The Navigation pane employs tree structure which allows you to take action upon the database and their objects through their pop-up menus quickly and easily. HTTP Tunneling is a method for connecting to a server that uses the same protocol (http://) and the same port (port 80) as a web server does. What you get by achieving your goals is not as important as what you become by achieving your goals. If opportunity doesn’t knock, build a door. Typically, it is employed as an encrypted version of Telnet. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. You will succeed because most people are lazy. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. Navicat Cloud provides a cloud service for synchronizing connections, queries, model files and virtual group information from Navicat, other Navicat family members, different machines and different platforms. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. It wasn’t raining when Noah built the ark. Difficult circumstances serve as a textbook of life for people. The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server, or Amazon RDS instance. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more. Sometimes you win, sometimes you learn. There is no way to happiness. Happiness is the way. The first step is as good as half over. A man’s best friends are his ten fingers. Navicat Data Modeler is a powerful and cost-effective database design tool which helps you build high-quality conceptual, logical and physical data models. Such sessions are also susceptible to session hijacking, where a malicious user takes over your session once you have authenticated. In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. How we spend our days is, of course, how we spend our lives. Actually it is just in an idea when feel oneself can achieve and cannot achieve. To connect to a database or schema, simply double-click it in the pane. The past has no power over the present moment. Success consists of going from failure to failure without loss of enthusiasm. The past has no power over the present moment. To clear or reload various internal caches, flush tables, or acquire locks, control-click your connection in the Navigation pane and select Flush and choose the flush option. You must have the reload privilege to use this feature. If the Show objects under schema in navigation pane option is checked at the Preferences window, all database objects are also displayed in the pane. In the middle of winter I at last discovered that there was in me an invincible summer. Genius is an infinite capacity for taking pains. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. Navicat Data Modeler enables you to build high-quality conceptual, logical and physical data models for a wide variety of audiences. Actually it is just in an idea when feel oneself can achieve and cannot achieve. Navicat Monitor is a safe, simple and agentless remote server monitoring tool that is packed with powerful features to make your monitoring effective as possible. Anyone who has never made a mistake has never tried anything new. Navicat provides a wide range advanced features, such as compelling code editing capabilities, smart code-completion, SQL formatting, and more. It wasn’t raining when Noah built the ark. What you get by achieving your goals is not as important as what you become by achieving your goals. In other words, Navicat provides the ability for data in different databases and/or schemas to be kept up-to-date so that each repository contains the same information. In other words, Navicat provides the ability for data in different databases and/or schemas to be kept up-to-date so that each repository contains the same information. What you get by achieving your goals is not as important as what you become by achieving your goals. Navicat Monitor can be installed on any local computer or virtual machine and does not require any software installation on the servers being monitored. Navicat Cloud could not connect and access your databases. By which it means, it could only store your connection settings, queries, model files, and virtual group; your database passwords and data (e.g. tables, views, etc) will not be stored to Navicat Cloud. In the middle of winter I at last discovered that there was in me an invincible summer. In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram buttons to change the object view. Genius is an infinite capacity for taking pains. The Information Pane shows the detailed object information, project activities, the DDL of database objects, object dependencies, membership of users/roles and preview. To get a secure connection, the first thing you need to do is to install OpenSSL Library and download Database Source. To start working with your server in Navicat, you should first establish a connection or several connections using the Connection window. Export Wizard allows you to export data from tables, collections, views, or query results to any available formats. Anyone who has never made a mistake has never tried anything new.', 176, 0, 1, '2012-03-25 22:08:57', '2007-08-29 18:03:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '2023-10-27 16:38:14', '2023-10-27 16:38:14'),
(2, 'User', '2023-10-27 16:38:14', '2023-10-27 16:38:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sliders`
--

CREATE TABLE `sliders` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `attribute` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `sliders`
--

INSERT INTO `sliders` (`id`, `name`, `content`, `image`, `url`, `attribute`, `status`, `id_user`, `createdAt`, `updatedAt`) VALUES
(1, 'Slider 1', 'New', 'web/images/slider/banner-1.jpg', '/', 1, 1, 1, '2023-10-31 12:36:09', '2023-10-31 12:36:09'),
(2, 'Slider 2', 'New', 'web/images/slider/banner-2.jpg', '/', 2, 1, 1, '2023-10-31 12:36:31', '2023-10-31 12:36:31'),
(3, 'Slider 3', 'New', 'web/images/slider/banner-3.jpg', '/', 3, 1, 1, '2023-10-31 12:36:46', '2023-10-31 12:36:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `id_role` int(11) DEFAULT 0,
  `code` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `image`, `status`, `id_role`, `code`, `createdAt`, `updatedAt`) VALUES
(1, 'Diep', 'NV', 'ngoquangdiep2001@gmail.com', '$2b$10$5wH8flE3zY4SuRPiZU.mIOTedALNCIt9djRqd7XEcNXgW5BFvZJ9a', NULL, 1, 1, NULL, '2023-10-27 16:38:36', '2023-10-27 16:38:36'),
(2, 'ABC', 'd', 'user@gmail.com', '$2b$10$X27GgiAFhdNxC0SPQ12J6ekQcscUIFJONQWeS13ZdqhftSefANEFW', NULL, 0, 2, NULL, '2023-10-27 15:15:51', '2023-10-27 15:15:51'),
(3, 'ewewewe', 'wewe', 'user1@gmail.com', '$2b$10$M1NXFKYdPh2kwAZquL/p2u8L2NYO3LRut6gPqbutyuzicYenrdOie', NULL, 1, 2, NULL, '2023-10-27 15:16:51', '2023-10-27 15:16:51'),
(4, 'tttt', 'yyy', 'user2@gmail.com', '$2b$10$TsG2QpQRDRmjpGb24HMj8.O9qLoUtSDOshtvpPauUcwJy56xQCImS', NULL, 1, 2, NULL, '2023-10-27 15:18:07', '2023-10-27 15:18:07'),
(11, 'Diep', 'ngo', 'diep_1951220125@dau.edu.vn', '$2b$10$AWzsMwrOZsb46OoFe2ZrueXglq2YiJxpEzkD2IJVt70bM4i2CmRJW', NULL, 1, 2, NULL, '2023-11-15 15:53:35', '2023-11-15 16:00:03');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Chỉ mục cho bảng `detail_orders`
--
ALTER TABLE `detail_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_product` (`id_product`),
  ADD KEY `id_order` (`id_order`);

--
-- Chỉ mục cho bảng `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Chỉ mục cho bảng `oders`
--
ALTER TABLE `oders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_address` (`id_address`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_role` (`id_role`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `detail_orders`
--
ALTER TABLE `detail_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `discounts`
--
ALTER TABLE `discounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `oders`
--
ALTER TABLE `oders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `detail_orders`
--
ALTER TABLE `detail_orders`
  ADD CONSTRAINT `detail_orders_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `detail_orders_ibfk_2` FOREIGN KEY (`id_order`) REFERENCES `oders` (`id`);

--
-- Các ràng buộc cho bảng `discounts`
--
ALTER TABLE `discounts`
  ADD CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `oders`
--
ALTER TABLE `oders`
  ADD CONSTRAINT `oders_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `oders_ibfk_3` FOREIGN KEY (`id_address`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `sliders`
--
ALTER TABLE `sliders`
  ADD CONSTRAINT `sliders_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
