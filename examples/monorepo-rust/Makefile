.PHONY: build-all test-all lint-all run-api run-worker

build-all:
	cargo build --workspace

test-all:
	cargo test --workspace

lint-all:
	cargo clippy --workspace -- -D warnings
	cargo fmt --check

run-api:
	cargo run -p api

run-worker:
	cargo run -p worker
