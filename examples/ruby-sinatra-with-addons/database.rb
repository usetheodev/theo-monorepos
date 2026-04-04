require "sequel"

DATABASE_URL = ENV.fetch("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/mydb")
DB = Sequel.connect(DATABASE_URL)

DB.create_table?(:users) do
  primary_key :id
  String :email, unique: true, null: false
  String :name
  DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
  DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
end

class User < Sequel::Model(:users)
end
