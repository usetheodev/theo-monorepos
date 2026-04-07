package queue

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
)

const TypeExample = "example:process"

type ExamplePayload struct {
	Message string `json:"message"`
}

func NewExampleTask(msg string) (*asynq.Task, error) {
	payload, err := json.Marshal(ExamplePayload{Message: msg})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeExample, payload), nil
}

func HandleExampleTask(ctx context.Context, t *asynq.Task) error {
	var p ExamplePayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return err
	}
	fmt.Printf("Processing task: %s\n", p.Message)
	return nil
}
