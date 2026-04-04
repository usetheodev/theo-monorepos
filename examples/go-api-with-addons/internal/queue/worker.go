package queue

import (
	"os"

	"github.com/hibiken/asynq"
)

func NewWorker(mux *asynq.ServeMux) *asynq.Server {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	opt, _ := asynq.ParseRedisURI(redisURL)
	srv := asynq.NewServer(opt, asynq.Config{
		Concurrency: 10,
	})

	return srv
}
