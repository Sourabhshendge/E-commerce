package com.SBS.E_commerce.controller;

import com.SBS.E_commerce.service.serviceImpl.DataMigrationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/migration")
public class MigrationController {

    private final DataMigrationService migrationService;

    public MigrationController(DataMigrationService migrationService) {
        this.migrationService = migrationService;
    }

    @PostMapping("/products")
    public String migrateProducts() {
        try {
            migrationService.migrateProducts();
            return "Migration completed successfully!";
        } catch (Exception e) {
            return "Migration failed: " + e.getMessage();
        }
    }
}
