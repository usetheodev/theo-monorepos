require_relative "app"

["TERM", "INT"].each do |signal|
  Signal.trap(signal) do
    $stdout.puts %({"time":"#{Time.now.iso8601}","level":"INFO","message":"#{signal} received, shutting down"})
    exit
  end
end

run App
