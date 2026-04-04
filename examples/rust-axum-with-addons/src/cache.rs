use redis::AsyncCommands;

pub async fn get_client() -> redis::Client {
    let url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".to_string());
    redis::Client::open(url).expect("Invalid Redis URL")
}
