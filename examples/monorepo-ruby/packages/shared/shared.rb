require "logger"

module Shared
  VERSION = "0.1.0"

  def self.json_logger
    logger = Logger.new($stdout)
    logger.formatter = proc do |severity, datetime, _progname, msg|
      %({"time":"#{datetime.iso8601}","level":"#{severity}","message":"#{msg}"}\n)
    end
    logger
  end
end
