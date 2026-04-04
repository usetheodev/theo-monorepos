.PHONY: build-all test-all lint-all run-api run-worker

build-all:
	cd apps/api && go build -o ../../bin/api .
	cd apps/worker && go build -o ../../bin/worker .

test-all:
	cd apps/api && go test ./...
	cd apps/worker && go test ./...
	cd pkg/shared && go test ./...

lint-all:
	cd apps/api && go vet ./...
	cd apps/worker && go vet ./...
	cd pkg/shared && go vet ./...

run-api:
	cd apps/api && go run .

run-worker:
	cd apps/worker && go run .
