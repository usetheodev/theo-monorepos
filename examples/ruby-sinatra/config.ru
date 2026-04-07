require_relative "app"

# Graceful shutdown
shutting_down = false

["TERM", "INT"].each do |signal|
  Signal.trap(signal) do
    shutting_down = true
    $stdout.puts %({"time":"#{Time.now.iso8601}","level":"INFO","message":"#{signal} received, shutting down"})
    exit
  end
end

run App
