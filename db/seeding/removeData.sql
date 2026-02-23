BEGIN;

TRUNCATE TABLE
	"mainSchema"."interviewHolders",
	"mainSchema"."teamSemesterUser",
	"mainSchema"."schoolAssignments",
	"mainSchema"."interviews",
	"mainSchema"."assistantApplications",
	"mainSchema"."teamApplications",
	"mainSchema"."applications",
	"mainSchema"."assistantUsers",
	"mainSchema"."teamUsers",
	"mainSchema"."expenses",
	"mainSchema"."sponsors",
	"mainSchema"."users",
	"mainSchema"."meetings",
	"mainSchema"."schools",
	"mainSchema"."semesters",
	"mainSchema"."teams",
	"mainSchema"."fieldsOfStudy",
	"mainSchema"."departments",
	"mainSchema"."interviewSchemas"
RESTART IDENTITY CASCADE;

COMMIT;
