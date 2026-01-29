BEGIN;

-- Departments
INSERT INTO "mainSchema"."departments" ("id", "city") VALUES
	(1, 'Trondheim'),
	(2, 'Bergen')
ON CONFLICT ("id") DO NOTHING;

-- Fields of study
INSERT INTO "mainSchema"."fieldsOfStudy" ("id", "studyCode", "name", "departmentId") VALUES
	(1, 'MTKJ', 'Mechanical Engineering', 1),
	(2, 'INF101', 'Computer Science', 1),
	(3, 'BIO200', 'Marine Biology', 2)
ON CONFLICT ("id") DO NOTHING;
/*  */
-- Teams
INSERT INTO "mainSchema"."teams"
	("id", "departmentId", "name", "email", "description", "shortDescription", "acceptApplication", "active", "deadline")
VALUES
	(
		1,
		1,
		'Logistics Trondheim',
		'logistics.trondheim@vektor.no',
		'Handles classroom logistics in Trondheim.',
		'Logistics Trondheim',
		true,
		true,
		'2023-12-15 23:59:00'
	),
	(
		2,
		1,
		'Public Relations Trondheim',
		'pr.trondheim@vektor.no',
		'Showcases Vektor at events and online.',
		'PR Trondheim',
		true,
		true,
		'2023-12-20 23:59:00'
	),
	(
		3,
		2,
		'Recruitment Bergen',
		'recruitment.bergen@vektor.no',
		'Coordinates mentor recruitment in Bergen.',
		'Recruitment Bergen',
		true,
		false,
		'2024-05-01 23:59:00'
	)
ON CONFLICT ("id") DO NOTHING;

-- Semesters
INSERT INTO "mainSchema"."semesters"
	(
		"id",
		"lastSemesterId",
		"semesterStartDate",
		"semesterEndDate",
		"recruitmentStartDate",
		"recruitmentEndDate",
		"departmentId",
		"name"
	)
VALUES
	(
		1,
		NULL,
		'2024-01-08',
		'2024-06-15',
		'2023-11-01',
		'2024-01-01',
		1,
		'Spring 2024 Trondheim'
	),
	(
		2,
		1,
		'2024-08-19',
		'2024-12-18',
		'2024-04-15',
		'2024-06-01',
		1,
		'Fall 2024 Trondheim'
	),
	(
		3,
		NULL,
		'2024-01-10',
		'2024-06-20',
		'2023-11-15',
		'2024-01-05',
		2,
		'Spring 2024 Bergen'
	)
ON CONFLICT ("id") DO NOTHING;

-- Meetings
INSERT INTO "mainSchema"."meetings"
	("id", "title", "description", "semesterId", "date", "timeStart", "timeEnd", "room")
VALUES
	(
		1,
		'Mentor Kickoff',
		'Kickoff for returning and new mentors.',
		1,
		'2024-01-15',
		'17:00:00',
		'19:00',
		'Gløshaugen A1'
	),
	(
		2,
		'Recruitment Retrospective',
		'Wrap-up for the fall recruitment.',
		2,
		'2024-09-05',
		'18:00:00',
		'20:00',
		'IT-bygget 42'
	)
ON CONFLICT ("id") DO NOTHING;

-- Schools
INSERT INTO "mainSchema"."schools"
	(
		"id",
		"departmentId",
		"name",
		"contactPersonName",
		"contactPersonPhoneNumber",
		"contactpersonEmail",
		"isInternational"
	)
VALUES
	(
		1,
		1,
		'Charlottenlund ungdomsskole',
		'Ingrid Lien',
		'93000001',
		'ingrid.lien@charlottenlund.no',
		false
	),
	(
		2,
		2,
		'International School Bergen',
		'Paul Jensen',
		'93000002',
		'paul.jensen@isb.no',
		true
	)
ON CONFLICT ("id") DO NOTHING;

-- Users
INSERT INTO "mainSchema"."users"
	(
		"id",
		"firstName",
		"lastName",
		"fieldOfStudyId",
		"accountNumber",
		"personalEmail",
		"phoneNumber"
	)
VALUES
	(
		1,
		'Frida',
		'Larsen',
		1,
		'12345678901',
		'frida.larsen@example.com',
		'40000001'
	),
	(
		2,
		'Eirik',
		'Sund',
		2,
		'23456789012',
		'eirik.sund@example.com',
		'40000002'
	),
	(
		3,
		'Maja',
		'Solheim',
		3,
		'34567890123',
		'maja.solheim@example.com',
		'40000003'
	)
ON CONFLICT ("id") DO NOTHING;

-- Team users
INSERT INTO "mainSchema"."teamUsers" ("id", "teamId", "username") VALUES
	(1, 1, 'frida.l'),
	(2, 2, 'eirik.s'),
	(3, 3, 'maja.s')
ON CONFLICT ("id") DO NOTHING;

-- Assistant users
INSERT INTO "mainSchema"."assistantUsers" ("id") VALUES
	(2),
	(3)
ON CONFLICT ("id") DO NOTHING;

-- Applications
INSERT INTO "mainSchema"."applications"
	(
		"id",
		"firstname",
		"lastname",
		"gender",
		"email",
		"fieldOfStudyId",
		"yearOfStudy",
		"phonenumber",
		"submitDate"
	)
VALUES
	(
		1,
		'Ola',
		'Nordmann',
		'male',
		'ola.nordmann@example.com',
		1,
		2,
		'90000001',
		'2023-11-25'
	),
	(
		2,
		'Kari',
		'Hansen',
		'female',
		'kari.hansen@example.com',
		2,
		1,
		'90000002',
		'2023-11-28'
	),
	(
		3,
		'Noor',
		'Ali',
		'other',
		'noor.ali@example.com',
		3,
		3,
		'90000003',
		'2023-12-02'
	)
ON CONFLICT ("id") DO NOTHING;

-- Team applications
INSERT INTO "mainSchema"."teamApplications"
	(
		"id",
		"applicationParentId",
		"teamId",
		"motivationText",
		"biography",
		"teamInterest"
	)
VALUES
	(
		1,
		1,
		1,
		'I love planning lessons and logistics.',
		'Second-year mechanical engineering student.',
		true
	),
	(
		2,
		2,
		2,
		'I want to tell new students about Vektor.',
		'First-year computer science student.',
		true
	),
	(
		3,
		3,
		3,
		'I am moving to Bergen and want to stay involved.',
		'Third-year marine biology student.',
		false
	)
ON CONFLICT ("id", "applicationParentId") DO NOTHING;

-- Assistant applications
INSERT INTO "mainSchema"."assistantApplications" ("id") VALUES
	(1),
	(2)
ON CONFLICT ("id") DO NOTHING;

-- Interview schemas
INSERT INTO "mainSchema"."interviewSchemas" ("id", "jsonSchema") VALUES
	(
		1,
		'{"title":"Assistant Interview","type":"object","properties":{"motivation":{"type":"string"}}}'::json
	),
	(
		2,
		'{"title":"Follow-up Interview","type":"object","properties":{"evaluation":{"type":"number"}}}'::json
	)
ON CONFLICT ("id") DO NOTHING;

-- Interviews
INSERT INTO "mainSchema"."interviews"
	(
		"id",
		"applicationId",
		"interviewSchemaId",
		"interviewAnswers",
		"isCancelled",
		"plannedTime",
		"timeFinished"
	)
VALUES
	(
		1,
		1,
		1,
		'{"motivation":"Help pupils learn math","score":5}'::json,
		false,
		'2024-01-20 10:00:00',
		'2024-01-20 11:00:00'
	),
	(
		2,
		2,
		2,
		'{"evaluation":3,"notes":"Needs more classroom experience"}'::json,
		false,
		'2024-01-22 14:00:00',
		'2024-01-22 15:00:00'
	)
ON CONFLICT ("id") DO NOTHING;

-- Interview holders
INSERT INTO "mainSchema"."interviewHolders" ("integerId", "interviewHolderId") VALUES
	(1, 1),
	(2, 2)
ON CONFLICT ("integerId", "interviewHolderId") DO NOTHING;

-- Expenses
INSERT INTO "mainSchema"."expenses"
	(
		"id",
		"userId",
		"title",
		"description",
		"moneyAmount",
		"accountNumber",
		"purchaseTime",
		"submitTime",
		"isAccepted",
		"handlingTime"
	)
VALUES
	(
		1,
		1,
		'Whiteboard markers',
		'Marker pack for school visit',
		250.00,
		'50123456789',
		'2024-02-01 12:00:00',
		'2024-02-02 09:00:00',
		true,
		'2024-02-05 10:00:00'
	),
	(
		2,
		2,
		'Bus tickets',
		'Travel to International School Bergen',
		180.50,
		'50123456780',
		'2024-02-10 08:15:00',
		'2024-02-10 20:00:00',
		false,
		'2024-02-12 09:30:00'
	)
ON CONFLICT ("id") DO NOTHING;

-- Sponsors
INSERT INTO "mainSchema"."sponsors"
	(
		"id",
		"name",
		"homePageURL",
		"startTime",
		"endTime",
		"size",
		"spesificDepartmentId"
	)
VALUES
	(
		1,
		'TechCorp',
		'https://techcorp.example.com',
		'2024-01-01 00:00:00',
		'2024-12-31 23:59:00',
		'medium',
		1
	),
	(
		2,
		'EduFuture',
		'https://edufuture.example.com',
		'2024-03-01 00:00:00',
		NULL,
		'small',
		NULL
	)
ON CONFLICT ("id") DO NOTHING;

-- School assignments
INSERT INTO "mainSchema"."schoolAssignments" ("schoolId", "semesterId", "userId") VALUES
	(1, 1, 2),
	(2, 3, 3)
ON CONFLICT ("semesterId", "userId") DO NOTHING;

-- Team members per semester
INSERT INTO "mainSchema"."teamSemesterUser" ("teamId", "semesterId", "teamUserId")
SELECT 1, 1, 1
WHERE NOT EXISTS (
	SELECT 1
	FROM "mainSchema"."teamSemesterUser"
	WHERE "teamId" = 1
		AND "semesterId" = 1
		AND "teamUserId" = 1
);

INSERT INTO "mainSchema"."teamSemesterUser" ("teamId", "semesterId", "teamUserId")
SELECT 2, 2, 2
WHERE NOT EXISTS (
	SELECT 1
	FROM "mainSchema"."teamSemesterUser"
	WHERE "teamId" = 2
		AND "semesterId" = 2
		AND "teamUserId" = 2
);

INSERT INTO "mainSchema"."teamSemesterUser" ("teamId", "semesterId", "teamUserId")
SELECT 3, 3, 3
WHERE NOT EXISTS (
	SELECT 1
	FROM "mainSchema"."teamSemesterUser"
	WHERE "teamId" = 3
		AND "semesterId" = 3
		AND "teamUserId" = 3
);

-- Align sequences so future inserts can rely on defaults
SELECT setval('"mainSchema"."departments_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."departments"), 0), true);
SELECT setval('"mainSchema"."fieldsOfStudy_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."fieldsOfStudy"), 0), true);
SELECT setval('"mainSchema"."teams_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."teams"), 0), true);
SELECT setval('"mainSchema"."semesters_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."semesters"), 0), true);
SELECT setval('"mainSchema"."meetings_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."meetings"), 0), true);
SELECT setval('"mainSchema"."schools_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."schools"), 0), true);
SELECT setval('"mainSchema"."users_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."users"), 0), true);
SELECT setval('"mainSchema"."applications_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."applications"), 0), true);
SELECT setval('"mainSchema"."teamApplications_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."teamApplications"), 0), true);
SELECT setval('"mainSchema"."interviewSchemas_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."interviewSchemas"), 0), true);
SELECT setval('"mainSchema"."interviews_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."interviews"), 0), true);
SELECT setval('"mainSchema"."expenses_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."expenses"), 0), true);
SELECT setval('"mainSchema"."sponsors_id_seq"', COALESCE((SELECT MAX("id") FROM "mainSchema"."sponsors"), 0), true);

COMMIT;
