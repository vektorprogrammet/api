import { departmentsTable } from "@/db/tables/departments";
import { expensesTable } from "@/db/tables/expenses";
import { fieldsOfStudyTable } from "@/db/tables/fields-of-study";
import { teamApplicationsTable } from "@/db/tables/team-applications";
import { teamsTable } from "@/db/tables/teams";
import { usersTable } from "@/db/tables/users";

export const seedingTables = {
	departmentsTable,
	fieldsOfStudyTable,
	teamsTable,
	usersTable,
	//teamUsersTable, these two tables dont work currently
	//assistantUsersTable,
	teamApplicationsTable,
	expensesTable,
};
