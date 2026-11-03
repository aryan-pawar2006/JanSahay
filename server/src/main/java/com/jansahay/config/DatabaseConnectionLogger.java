package com.jansahay.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DatabaseConnectionLogger {

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:}")
    private String datasourceUsername;

    @Value("${DB_HOST:not_set}")
    private String dbHost;

    @Value("${DB_PORT:not_set}")
    private String dbPort;

    @Value("${DB_NAME:not_set}")
    private String dbName;

    @PostConstruct
    public void logConnectionDetails() {
        log.info("================================================================");
        log.info("🔌 MYSQL CONNECTION CONFIGURATION DIAGNOSTICS:");
        log.info("   • DB_HOST env:     '{}'", dbHost);
        log.info("   • DB_PORT env:     '{}'", dbPort);
        log.info("   • DB_NAME env:     '{}'", dbName);
        log.info("   • DB_USERNAME:     '{}'", datasourceUsername);
        String sanitizedUrl = datasourceUrl.replaceAll(":[^/@:]+@", ":****@");
        log.info("   • Resolved JDBC:   '{}'", sanitizedUrl);

        if ("localhost".equalsIgnoreCase(dbHost) || "not_set".equalsIgnoreCase(dbHost)) {
            log.warn("⚠️ WARNING: DB_HOST is set to '{}'! If deploying on Render, you MUST set DB_HOST to your Aiven MySQL host (e.g. mysql-xxx.aivencloud.com).", dbHost);
        }
        if ("3306".equals(dbPort) && dbHost.contains("aivencloud.com")) {
            log.warn("⚠️ NOTICE: DB_PORT is set to 3306. Aiven MySQL usually uses a high port (e.g. 10000-28000). Check the Port in your Aiven Console.");
        }
        if (dbHost.contains(":")) {
            log.error("❌ ERROR: DB_HOST contains a colon ':'. Do not include the port in DB_HOST. Enter the port into DB_PORT separately.");
        }
        if (dbHost.startsWith("http://") || dbHost.startsWith("https://") || dbHost.startsWith("mysql://")) {
            log.error("❌ ERROR: DB_HOST contains a URL protocol. Use only the hostname without http:// or mysql://.");
        }
        log.info("================================================================");
    }
}
