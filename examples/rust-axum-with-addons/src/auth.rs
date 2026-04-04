use axum::{
    extract::Request,
    http::{header, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
    Json,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

fn get_secret() -> String {
    std::env::var("JWT_SECRET").unwrap_or_else(|_| "change-me-in-production".to_string())
}

pub async fn authenticate(req: Request, next: Next) -> Response {
    let auth_header = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let token = auth_header.strip_prefix("Bearer ").unwrap_or("");
    if token.is_empty() {
        return (StatusCode::UNAUTHORIZED, Json(json!({"error": "Unauthorized"}))).into_response();
    }

    match decode::<Claims>(
        token,
        &DecodingKey::from_secret(get_secret().as_bytes()),
        &Validation::default(),
    ) {
        Ok(_) => next.run(req).await,
        Err(_) => (StatusCode::UNAUTHORIZED, Json(json!({"error": "Invalid token"}))).into_response(),
    }
}

pub fn generate_token(sub: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let claims = Claims {
        sub: sub.to_string(),
        exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
    };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(get_secret().as_bytes()))
}
