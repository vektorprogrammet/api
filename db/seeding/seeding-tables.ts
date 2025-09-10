import { departmentsTable } from "@/db/tables/departments";
import { expensesTable } from "@/db/tables/expenses";
import { fieldsOfStudyTable } from "@/db/tables/fields-of-study";
import { teamsTable } from "@/db/tables/teams";
import { usersTable } from "@/db/tables/users";
import { meetings } from "@/db/tables/meetings";

export const seedingTables = {
	departmentsTable,
	fieldsOfStudyTable,
	teamsTable,
	usersTable,
	meetings,
	//teamUsersTable, these two tables dont work currently
	//assistantUsersTable,
	//teamApplicationsTable,
	expensesTable,
};
