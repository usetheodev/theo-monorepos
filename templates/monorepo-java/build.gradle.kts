plugins {
    java
}

subprojects {
    apply(plugin = "java")

    group = "com.theo"
    version = "0.1.0"

    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }

    repositories {
        mavenCentral()
    }
}
