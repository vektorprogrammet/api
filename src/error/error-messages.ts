const ORM_ERROR_MESSAGES = [
	"Database access error",
	"Connection failed",
	"Query execution error",
	"Entity not found",
	"Validation error",
	"Duplicate entry",
	"Missing required field",
	"Foreign key constraint violation",
	"Transaction failed",
	"Database timeout",
	"Invalid data type",
	"Record already exists",
	"Update conflict",
	"Permission denied",
	"Schema mismatch",
	"Data integrity violation",
	"Record locked",
	"Too many connections",
	"Unsupported operation",
	"Out of memory",
	"Rollback error",
	"Data not saved",
	"Invalid query syntax",
	"Database not reachable",
	"Session expired",
	"Query timeout",
	"Already handled",
	"Couln't find all entries",
	"Wrong database response format",
	"Failed to insert all entries",
] as const;
const HTTP_CLIENT_ERROR_MESSAGES = [
	"Invalid request format",
	"Missing required parameters",
	"Unauthorized access attempt",
	"User not found in the system",
	"Invalid credentials provided",
	"Session has expired",
	"Access denied to the requested resource",
	"Request timeout",
	"Invalid input data",
	"Resource not available",
	"Quota exceeded for this request",
	"Insufficient permissions for this action",
	"Request could not be processed",
	"Bad request syntax",
	"Operation not allowed",
	"Request entity too large",
	"Unsupported media type",
	"Method not allowed for this endpoint",
	"Invalid query parameters",
	"Resource already exists",
	"Rate limit exceeded",
	"Validation error occurred",
	"Unexpected error during request handling",
	"Service unavailable temporarily",
	"Request redirected to another endpoint",
	"Conflict with the current state of the resource",
	"Data not found in the database",
	"Duplicate entry in the database",
	"Database transaction failed",
	"Database timeout occurred",
	"Insufficient permissions to access the database",
	"Data integrity violation",
	"Failed to retrieve data from the database",
	"Database schema mismatch",
	"Failed to execute the database command",
	"Error parsing database response",
	"Database error",
] as const;
const HTTP_SERVER_ERROR_MESSAGES = [
	"Internal server error occurred",
	"Database connection failed",
	"Unexpected error on the server",
	"Service is currently down for maintenance",
	"Server encountered an unexpected condition",
	"Failed to process the request due to a server error",
	"Resource could not be retrieved",
	"Server overload, please try again later",
	"Error while processing data",
	"Application error occurred",
	"Service timeout while processing the request",
	"Insufficient resources to handle the request",
	"Unexpected response from external service",
	"Error in server configuration",
	"Failed to load required modules",
	"Server encountered a critical error",
	"Data processing error",
	"Security violation detected",
	"Service is temporarily unavailable",
	"Error while communicating with the backend",
	"Server is busy, please retry later",
	"Network error while processing the request",
	"Error while handling user session",
	"Configuration error in the application",
	"Error while generating response",
	"Server is unable to fulfill the request",
	"Database connection error",
	"Database query execution failed",
	"Database server is down",
	"Error while migrating database",
	"Database deadlock detected",
	"Database index not found",
	"Error while updating database records",
	"Database timeout while executing query",
	"Data corruption detected in the database",
	"Invalid database credentials",
	"Error while closing database connection",
	"Database backup failed",
	"Database restore operation failed",
	"Database schema update required",
	"Error while fetching records from the database",
] as const;
export type OrmErrorMessage = (typeof ORM_ERROR_MESSAGES)[number];
export type HttpClientErrorMessage =
	(typeof HTTP_CLIENT_ERROR_MESSAGES)[number];
export type HttpServerErrorMessage =
	(typeof HTTP_SERVER_ERROR_MESSAGES)[number];
export type HttpErrorMessage = HttpClientErrorMessage | HttpServerErrorMessage;
