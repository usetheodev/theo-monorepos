package queue

import (
	"os"

	"github.com/hibiken/asynq"
)

var Client *asynq.Client

func Connect() {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	opt, _ := asynq.ParseRedisURI(redisURL)
	Client = asynq.NewClient(opt)
}

func Enqueue(task *asynq.Task, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	return Client.Enqueue(task, opts...)
}
