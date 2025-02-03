# Spring 1

## Auto-configuration
- 基於條件化配置和@EnableAutoConfiguration實現的，允許在項目中引入相關的依賴，SpringBoot將根據dependencies自動配置application context和功能。
- SpringBoot定義了一套接口規范：在startup時會掃描外部引用jar包中的META-INF/spring.factories文件，將文件中配置類型信息加載到Spring容器
- 簡而言之，通過annotation or 簡單的配置就可以在SpringBoot的幫助下開啟或配置各種功能，比如db access，web開發

## Spring Boot Starter
- `spring-boot-starter-web`: Include Spring MVC & Tomcat嵌入式服務器，用于快速構建web app
- `spring-boot-starter-security`: 提供了Spring Security的基本配置，快速實現應用的安全性，包含認證和授權功能
- `spring-boot-starter-data-jpa` OR `spring-boot-starter-jdbc`: 如果使用的是Java Persistence API(JPA)進行db操作，那應該使用spring-boot-starter-jdbc。這個starter包含了hibernate等jpa實現以及db連接池等必要的庫，可以輕鬆與MySQL db進行交互。需要在application.properties OR application.yml中配置MySQL的連接信息。如果傾向直接使用jdbc可使用spring-boot-starter-jdbc，提供了基本jdbc的支持。
- `spring-boot-starter-data-redis`: 用于integrate Redis as a data store or cache。這個Starter包含了與Redis交互所需的client(default: Jedis,也可以配置為Lettuce)，以及Spring Data Redis的支持。需要在config file中設置Redis服務器的連接信息。
- `spring-boot-starter-test`: 包含了JUnit，Spring Test，AssertJ等用於unit test的library

## Why need spring-boot-maven-plugin?
- 將SpringBoot application打包成可執行的JAR/WAR文件，會將dependencies的JAR包全部打包進去，生成了一個包含所有dependencies和資源文件可以執行的JAR文件
