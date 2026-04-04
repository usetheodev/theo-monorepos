module example.com/go-api-with-addons

go 1.22

require (
	gorm.io/gorm v1.25.12
	gorm.io/driver/postgres v1.5.11
)

require github.com/redis/go-redis/v9 v9.7.0

require github.com/golang-jwt/jwt/v5 v5.2.1

require github.com/hibiken/asynq v0.24.1
