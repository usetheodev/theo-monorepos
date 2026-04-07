require "jwt"

JWT_SECRET = ENV.fetch("JWT_SECRET", "change-me-in-production")

def authenticate!(request)
  auth = request.env["HTTP_AUTHORIZATION"]
  halt 401, { error: "Unauthorized" }.to_json unless auth&.start_with?("Bearer ")

  token = auth.sub("Bearer ", "")
  begin
    JWT.decode(token, JWT_SECRET, true, algorithm: "HS256")
  rescue JWT::DecodeError
    halt 401, { error: "Invalid token" }.to_json
  end
end

def generate_token(payload)
  payload[:exp] = Time.now.to_i + 86_400
  JWT.encode(payload, JWT_SECRET, "HS256")
end
