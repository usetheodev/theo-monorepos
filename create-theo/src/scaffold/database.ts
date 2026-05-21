import type { TemplateInfo } from "../templates.js";
import type { FileDraft } from "./file-draft.js";

export function generateDatabaseDrafts(template: TemplateInfo): FileDraft[] {
  switch (template.language) {
    case "node":
      return generatePrismaDrafts(template);
    case "go":
      return generateGormDrafts();
    case "python":
      return generateSqlalchemyDrafts();
    case "rust":
      return generateDieselDrafts();
    case "java":
      return generateSpringDataJpaDrafts();
    case "ruby":
      return generateSequelDrafts();
    case "php":
      return generateDoctrineDrafts();
    default:
      return [];
  }
}

function generatePrismaDrafts(template: TemplateInfo): FileDraft[] {
  const isTypeScript = template.id === "node-nestjs";

  const drafts: FileDraft[] = [
    {
      kind: "dependency",
      target: "package.json",
      deps: { "@prisma/client": "^6.0.0" },
      devDeps: { prisma: "^6.0.0" },
      scripts: {
        "db:generate": "prisma generate",
        "db:migrate": "prisma migrate dev",
        "db:studio": "prisma studio",
      },
      source: "database",
    },
    {
      kind: "text",
      path: "prisma/schema.prisma",
      content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
    },
  ];

  if (isTypeScript) {
    drafts.push({
      kind: "text",
      path: "src/lib/db.ts",
      content: `import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
`,
    });
  } else {
    drafts.push({
      kind: "text",
      path: "src/lib/db.js",
      content: `const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = { prisma };
`,
    });
  }

  return drafts;
}

function generateGormDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "go.mod",
      appendText: `
require (
\tgorm.io/gorm v1.25.12
\tgorm.io/driver/postgres v1.5.11
)
`,
      source: "database",
    },
    {
      kind: "text",
      path: "internal/database/database.go",
      content: `package database

import (
\t"fmt"
\t"os"

\t"gorm.io/driver/postgres"
\t"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() error {
\tdsn := os.Getenv("DATABASE_URL")
\tif dsn == "" {
\t\tdsn = "host=localhost user=postgres password=postgres dbname=mydb port=5432 sslmode=disable"
\t}

\tdb, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
\tif err != nil {
\t\treturn fmt.Errorf("failed to connect to database: %w", err)
\t}

\tDB = db
\treturn nil
}
`,
    },
    {
      kind: "text",
      path: "internal/models/user.go",
      content: `package models

import "time"

type User struct {
\tID        uint      \`json:"id" gorm:"primaryKey"\`
\tEmail     string    \`json:"email" gorm:"uniqueIndex"\`
\tName      string    \`json:"name"\`
\tCreatedAt time.Time \`json:"created_at"\`
\tUpdatedAt time.Time \`json:"updated_at"\`
}
`,
    },
  ];
}

function generateSqlalchemyDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "requirements.txt",
      appendText: `sqlalchemy>=2.0.0\npsycopg2-binary>=2.9.0\nalembic>=1.13.0\n`,
      source: "database",
    },
    {
      kind: "text",
      path: "database.py",
      content: `import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://user:password@localhost:5432/mydb"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
`,
    },
    {
      kind: "text",
      path: "models.py",
      content: `from sqlalchemy import Column, DateTime, Integer, String, func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
`,
    },
  ];
}

function generateDieselDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "Cargo.toml",
      appendText: `\n[dependencies.diesel]\nversion = "2"\nfeatures = ["postgres"]\n\n[dependencies.dotenvy]\nversion = "0.15"\n`,
      source: "database",
    },
    {
      kind: "text",
      path: "src/db.rs",
      content: `use diesel::prelude::*;
use diesel::pg::PgConnection;
use std::env;

pub fn establish_connection() -> PgConnection {
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://postgres:postgres@localhost:5432/mydb".to_string());
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
`,
    },
  ];
}

function generateSpringDataJpaDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "build.gradle.kts",
      replacePatterns: [
        {
          search:
            'implementation("org.springframework.boot:spring-boot-starter-web")',
          replace: `implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("org.postgresql:postgresql")`,
        },
      ],
      source: "database",
    },
    {
      kind: "dependency",
      target: "src/main/resources/application.yml",
      appendText: `
  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost:5432/mydb}
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
`,
      source: "database",
    },
    {
      kind: "text",
      path: "src/main/java/com/theo/app/entity/User.java",
      content: `package com.theo.app.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
`,
    },
    {
      kind: "text",
      path: "src/main/java/com/theo/app/repository/UserRepository.java",
      content: `package com.theo.app.repository;

import com.theo.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
`,
    },
  ];
}

function generateSequelDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "Gemfile",
      appendText: `\ngem "sequel", "~> 5.0"\ngem "pg", "~> 1.5"\n`,
      source: "database",
    },
    {
      kind: "text",
      path: "database.rb",
      content: `require "sequel"

DATABASE_URL = ENV.fetch("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/mydb")
DB = Sequel.connect(DATABASE_URL)

DB.create_table?(:users) do
  primary_key :id
  String :email, unique: true, null: false
  String :name
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
  DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
end

class User < Sequel::Model(:users)
end
`,
    },
  ];
}

function generateDoctrineDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "composer.json",
      deps: {
        "doctrine/dbal": "^4.0",
        "doctrine/orm": "^3.0",
      },
      source: "database",
    },
    {
      kind: "text",
      path: "src/database.php",
      content: `<?php

declare(strict_types=1);

use Doctrine\\DBAL\\DriverManager;

$databaseUrl = getenv('DATABASE_URL') ?: 'pdo-pgsql://postgres:postgres@localhost:5432/mydb';

$connection = DriverManager::getConnection(['url' => $databaseUrl]);
`,
    },
  ];
}
