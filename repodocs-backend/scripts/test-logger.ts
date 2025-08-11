import { config } from "dotenv";
import { LoggerService } from "../src/utils";

// Load environment variables
config();

async function testLogger() {
  console.log("🧪 Testing Logger Service...\n");

  // Create logger with context
  const logger = new LoggerService();
  logger.setContext({
    service: "TestService",
    method: "testLogger",
  });

  console.log("📝 Testing all log levels:");
  console.log("========================\n");

  // Test all log levels
  logger.fatal("This is a FATAL message - Application cannot continue");
  logger.error("This is an ERROR message - Something went wrong");
  logger.warn("This is a WARNING message - Something unexpected happened");
  logger.info("This is an INFO message - General information");
  logger.debug("This is a DEBUG message - Detailed debugging info");
  logger.trace("This is a TRACE message - Most detailed execution info");

  console.log("\n📊 Testing specialized logging methods:");
  console.log("=====================================\n");

  // Test specialized methods
  logger.performance("Database Query", 150, {
    table: "users",
    operation: "SELECT",
  });
  logger.database("SELECT", "users", 45, { userId: "123" });
  logger.http("GET", "/api/health", 200, 120, { userAgent: "Mozilla/5.0" });
  logger.http("POST", "/api/users", 400, 85, {
    validationErrors: ["email required"],
  });
  logger.auth("User Login", "user-123", { ip: "192.168.1.1" });
  logger.business("User Created", "User", "user-456", { plan: "free" });

  console.log("\n🔍 Testing context management:");
  console.log("=============================\n");

  // Test context management
  logger.setContext({ service: "UserService", method: "createUser" });
  logger.info("User creation started");

  logger.addContext({ userId: "user-789", requestId: "req-123" });
  logger.info("User creation in progress");

  console.log("\n❌ Testing error logging:");
  console.log("========================\n");

  // Test error logging
  try {
    throw new Error("This is a test error for logging");
  } catch (error) {
    logger.errorWithStack("An error occurred during testing", error as Error, {
      additionalContext: "test data",
    });
  }

  console.log("\n✅ Logger test completed!");
  console.log("📁 Check the logs/ directory for log files");
  console.log("🔧 Environment:", process.env.NODE_ENV || "development");
}

testLogger().catch(console.error);
