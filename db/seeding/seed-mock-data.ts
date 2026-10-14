import { and, eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { assistantSemestersTable } from "@/db/tables/assistant-semesters";
import { departmentsTable } from "@/db/tables/departments";
import { fieldsOfStudyTable } from "@/db/tables/fields-of-study";
import { semestersTable } from "@/db/tables/semesters";
import { teamSemesterUsersTable } from "@/db/tables/team-semester-user";
import { teamsTable } from "@/db/tables/teams";
import {
	assistantUsersTable,
	teamUsersTable,
	usersTable,
} from "@/db/tables/users";
import { database, postgresClient } from "@/db/setup/query-postgres";

type City = "Trondheim" | "Ås" | "Bergen";

const locations: { city: City; key: string }[] = [
	{ city: "Trondheim", key: "trondheim" },
	{ city: "Ås", key: "aas" },
	{ city: "Bergen", key: "bergen" },
];

// Team names, public summaries, and role-based contact addresses are from
// https://vektorprogrammet.no/team. Individual member details are not imported.
const teams = [
	{
		key: "trondheim-styret",
		city: "Trondheim",
		name: "Styret",
		email: "styret.ntnu@vektorprogrammet.no",
		description: "Ansvarlig for driften av Vektorprogrammet i Trondheim.",
	},
	{
		key: "trondheim-evaluering",
		city: "Trondheim",
		name: "Evaluering",
		email: "evaluering.ntnu@vektorprogrammet.no",
		description:
			"Vi sender ut spørreundersøkelser, lager statistikk av dem og skriver så semester- og årsrapporter.",
	},
	{
		key: "trondheim-rekruttering",
		city: "Trondheim",
		name: "Rekruttering",
		email: "rekruttering.ntnu@vektorprogrammet.no",
		description: "I rekruttering jobber vi med å skaffe nye vektorassistenter!",
	},
	{
		key: "trondheim-skolekoordinering",
		city: "Trondheim",
		name: "Skolekoordinering",
		email: "skolekoordinering.ntnu@vektorprogrammet.no",
		description:
			"Skolekoordinering fungerer som et bindeledd mellom skolene og vektorassistentene gjennom semesteret.",
	},
	{
		key: "trondheim-sponsor",
		city: "Trondheim",
		name: "Sponsor",
		email: "sponsor.ntnu@vektorprogrammet.no",
		description:
			"Vektorprogrammets bindeledd til næringslivet, samarbeidspartnere og sponsorer.",
	},
	{
		key: "trondheim-okonomi",
		city: "Trondheim",
		name: "Økonomi",
		email: "okonomi@vektorprogrammet.no",
		description: "Økonomiteamet har ansvaret for Vektorprogrammets økonomi.",
	},
	{
		key: "trondheim-ekspansjon",
		city: "Trondheim",
		name: "Ekspansjon",
		email: "ekspansjon@vektorprogrammet.no",
		description:
			"Ekspansjon er teamet som har ansvaret for kontakten mellom lokalstyrene og utvidelse til Tromsø.",
	},
	{
		key: "trondheim-it",
		city: "Trondheim",
		name: "IT",
		email: "it@vektorprogrammet.no",
		description:
			"IT-teamet utvikler og drifter Vektorprogrammets nettside og interne datasystemer.",
	},
	{
		key: "trondheim-profilering",
		city: "Trondheim",
		name: "Profilering",
		email: "profilering.ntnu@vektorprogrammet.no",
		description:
			"Profileringsteamet jobber for å gjøre Vektorprogrammet mer synlig gjennom sosiale medier.",
	},
	{
		key: "aas-styret",
		city: "Ås",
		name: "Styret",
		email: "nmbu@vektorprogrammet.no",
		description: "Ansvarlig for driften av Vektorprogrammet i Ås.",
	},
	{
		key: "aas-sponsor",
		city: "Ås",
		name: "Sponsor",
		email: "sponsor.nmbu@vektorprogrammet.no",
		description:
			"Har ansvaret for økonomien og sponsorene til Vektorprogrammet Ås.",
	},
	{
		key: "aas-skolekoordinering",
		city: "Ås",
		name: "Skolekoordinering",
		email: "skolekoordinering.nmbu@vektorprogrammet.no",
		description:
			"Skolekoordinering har ansvaret for kontakten med skolene og organisering av assistentene.",
	},
	{
		key: "aas-rekruttering",
		city: "Ås",
		name: "Rekruttering",
		email: "evaluering.nmbu@vektorprogrammet.no",
		description:
			"Vi rekrutterer nye assistenter, styrer sosiale medier og sender ut evalueringers-undersøkelser.",
	},
	{
		key: "aas-sosialt",
		city: "Ås",
		name: "Sosialt",
		email: "sosialt.nmbu@vektorprogrammet.no",
		description:
			"Vi arrangerer sosiale arrangementer for assistenter og sørger for at alle trives i vervet.",
	},
	{
		key: "bergen-styret",
		city: "Bergen",
		name: "Styret",
		email: "uib@vektorprogrammet.no",
		description: "Ansvarlig for driften av Vektorprogrammet i Bergen.",
	},
	{
		key: "bergen-skolekoordinering",
		city: "Bergen",
		name: "Skolekoordinering",
		email: "skolekoordinering.uib@vektorprogrammet.no",
		description:
			"Skolekoordinering fungerer som et bindeledd mellom skolene og vektorassistentene gjennom semesteret.",
	},
	{
		key: "bergen-rekruttering",
		city: "Bergen",
		name: "Rekruttering",
		email: "rekruttering.uib@vektorprogrammet.no",
		description: "I rekruttering jobber vi med å skaffe nye vektorassistenter!",
	},
	{
		key: "bergen-sponsor",
		city: "Bergen",
		name: "Sponsor",
		email: "sponsor.uib@vektorprogrammet.no",
		description:
			"Vektorprogrammet UiB sitt bindeledd til næringslivet, samarbeidspartnere og sponsorer.",
	},
	{
		key: "bergen-profilering",
		city: "Bergen",
		name: "Profilering",
		email: "profilering.uib@vektorprogrammet.no",
		description:
			"Profileringsteamet jobber for å gjøre Vektorprogrammet mer synlig gjennom sosiale medier.",
	},
	{
		key: "hovedstyret",
		// The schema only models city departments; its published office is in Trondheim.
		city: "Trondheim",
		name: "Hovedstyret",
		email: "hovedstyret@vektorprogrammet.no",
		description:
			"Hovedstyret er det nasjonale styret i Vektorprogrammet med et overordnet ansvar for driften av hele organisasjonen.",
	},
] as const;

const mockMembersPerTeam = 2;
const mockAssistantsPerCity = 2;

function makeDate(year: number, month: number, day: number): Date {
	return new Date(Date.UTC(year, month - 1, day));
}

async function seedMockData(): Promise<void> {
	const year = new Date().getUTCFullYear();
	const semesterName = `Mock Autumn ${year}`;
	const departmentIds = new Map<City, number>();
	const fieldOfStudyIds = new Map<City, number>();
	const semesterIds = new Map<City, number>();

	await database.transaction(async (tx) => {
		async function getOrCreateUser(
			key: string,
			fieldOfStudyId: number,
			mockLastName: string,
		): Promise<number> {
			const personalEmail = `${key}@example.invalid`;
			const [existingUser] = await tx
				.select({ id: usersTable.id })
				.from(usersTable)
				.where(eq(usersTable.personalEmail, personalEmail))
				.limit(1);
			if (existingUser) return existingUser.id;

			const [newUser] = await tx
				.insert(usersTable)
				.values({
					firstName: "Mock",
					lastName: mockLastName,
					fieldOfStudyId,
					personalEmail,
					phoneNumber: `MOCK-PHONE-${key}`,
				})
				.returning({ id: usersTable.id });
			if (!newUser)
				throw new Error(`Could not create mock user ${personalEmail}`);
			return newUser.id;
		}

		for (const location of locations) {
			const [existingDepartment] = await tx
				.select({ id: departmentsTable.id })
				.from(departmentsTable)
				.where(eq(departmentsTable.city, location.city))
				.limit(1);
			const [newDepartment] = existingDepartment
				? []
				: await tx
						.insert(departmentsTable)
						.values({ city: location.city })
						.returning({ id: departmentsTable.id });
			const departmentId = existingDepartment?.id ?? newDepartment?.id;
			if (departmentId === undefined) {
				throw new Error(`Could not create ${location.city} department`);
			}
			departmentIds.set(location.city, departmentId);

			const studyCode = `MOCK-${location.key.toUpperCase()}-STUDY`;
			const [existingStudy] = await tx
				.select({ id: fieldsOfStudyTable.id })
				.from(fieldsOfStudyTable)
				.where(eq(fieldsOfStudyTable.studyCode, studyCode))
				.limit(1);
			const [newStudy] = existingStudy
				? []
				: await tx
						.insert(fieldsOfStudyTable)
						.values({
							studyCode,
							name: `Mock STEM Studies - ${location.city}`,
							departmentId,
						})
						.returning({ id: fieldsOfStudyTable.id });
			const fieldOfStudyId = existingStudy?.id ?? newStudy?.id;
			if (fieldOfStudyId === undefined) {
				throw new Error(`Could not create mock study for ${location.city}`);
			}
			fieldOfStudyIds.set(location.city, fieldOfStudyId);

			const [existingSemester] = await tx
				.select({ id: semestersTable.id })
				.from(semestersTable)
				.where(
					and(
						eq(semestersTable.departmentId, departmentId),
						eq(semestersTable.name, semesterName),
					),
				)
				.limit(1);
			const [newSemester] = existingSemester
				? []
				: await tx
						.insert(semestersTable)
						.values({
							name: semesterName,
							departmentId,
							semesterStartDate: makeDate(year, 8, 15),
							semesterEndDate: makeDate(year, 12, 20),
							recruitmentStartDate: makeDate(year, 7, 15),
							recruitmentEndDate: makeDate(year, 8, 31),
						})
						.returning({ id: semestersTable.id });
			const semesterId = existingSemester?.id ?? newSemester?.id;
			if (semesterId === undefined) {
				throw new Error(`Could not create mock semester for ${location.city}`);
			}
			semesterIds.set(location.city, semesterId);
		}

		for (const team of teams) {
			const departmentId = departmentIds.get(team.city);
			const fieldOfStudyId = fieldOfStudyIds.get(team.city);
			const semesterId = semesterIds.get(team.city);
			if (
				departmentId === undefined ||
				fieldOfStudyId === undefined ||
				semesterId === undefined
			) {
				throw new Error(`Missing seed references for ${team.key}`);
			}

			const [existingTeam] = await tx
				.select({ id: teamsTable.id, departmentId: teamsTable.departmentId })
				.from(teamsTable)
				.where(eq(teamsTable.email, team.email))
				.limit(1);
			if (existingTeam && existingTeam.departmentId !== departmentId) {
				throw new Error(
					`Team email ${team.email} is already used in another city`,
				);
			}
			const [newTeam] = existingTeam
				? []
				: await tx
						.insert(teamsTable)
						.values({
							departmentId,
							name: team.name,
							email: team.email,
							description: team.description,
							shortDescription: team.description,
							acceptApplication: false,
							active: true,
							deadline: null,
						})
						.returning({ id: teamsTable.id });
			const teamId = existingTeam?.id ?? newTeam?.id;
			if (teamId === undefined) throw new Error(`Could not create ${team.key}`);

			for (
				let memberIndex = 1;
				memberIndex <= mockMembersPerTeam;
				memberIndex++
			) {
				const memberNumber = String(memberIndex).padStart(2, "0");
				const userId = await getOrCreateUser(
					`mock-${team.key}-member-${memberNumber}`,
					fieldOfStudyId,
					`Member ${memberNumber} - ${team.city} ${team.name}`,
				);
				const [existingTeamUser] = await tx
					.select({ id: teamUsersTable.id, teamId: teamUsersTable.teamId })
					.from(teamUsersTable)
					.where(eq(teamUsersTable.id, userId))
					.limit(1);
				if (existingTeamUser && existingTeamUser.teamId !== teamId) {
					throw new Error(`Mock member ${userId} belongs to a different team`);
				}
				if (!existingTeamUser) {
					await tx.insert(teamUsersTable).values({
						id: userId,
						teamId,
						username: `mock-${team.key}-${memberNumber}`,
					});
				}

				const [existingMembership] = await tx
					.select({ teamUserId: teamSemesterUsersTable.teamUserId })
					.from(teamSemesterUsersTable)
					.where(
						and(
							eq(teamSemesterUsersTable.teamId, teamId),
							eq(teamSemesterUsersTable.semesterId, semesterId),
							eq(teamSemesterUsersTable.teamUserId, userId),
						),
					)
					.limit(1);
				if (!existingMembership) {
					await tx.insert(teamSemesterUsersTable).values({
						teamId,
						semesterId,
						teamUserId: userId,
					});
				}
			}
		}

		for (const location of locations) {
			const fieldOfStudyId = fieldOfStudyIds.get(location.city);
			const semesterId = semesterIds.get(location.city);
			if (fieldOfStudyId === undefined || semesterId === undefined) {
				throw new Error(
					`Missing assistant seed references for ${location.city}`,
				);
			}

			for (
				let assistantIndex = 1;
				assistantIndex <= mockAssistantsPerCity;
				assistantIndex++
			) {
				const assistantNumber = String(assistantIndex).padStart(2, "0");
				const userId = await getOrCreateUser(
					`mock-assistant-${location.key}-${assistantNumber}`,
					fieldOfStudyId,
					`Assistant ${assistantNumber} - ${location.city}`,
				);

				const [existingAssistant] = await tx
					.select({ id: assistantUsersTable.id })
					.from(assistantUsersTable)
					.where(eq(assistantUsersTable.id, userId))
					.limit(1);
				if (!existingAssistant) {
					await tx.insert(assistantUsersTable).values({ id: userId });
				}

				const [existingAssistantSemester] = await tx
					.select({ assistantId: assistantSemestersTable.assistantId })
					.from(assistantSemestersTable)
					.where(
						and(
							eq(assistantSemestersTable.assistantId, userId),
							eq(assistantSemestersTable.semesterId, semesterId),
						),
					)
					.limit(1);
				if (!existingAssistantSemester) {
					await tx.insert(assistantSemestersTable).values({
						assistantId: userId,
						semesterId,
						isSubstitute: false,
					});
				}
			}
		}
	});

	console.info(
		`Mock database data seeded: ${teams.length} teams, ${teams.length * mockMembersPerTeam} team members, and ${locations.length * mockAssistantsPerCity} assistants.`,
	);
}

async function resetSchemaAndMigrate(): Promise<void> {
	console.warn(
		'Dropping schemas "mainSchema" and "drizzle" before rebuilding the mock database.',
	);
	await database.transaction(async (tx) => {
		await tx.execute(sql.raw('DROP SCHEMA IF EXISTS "mainSchema" CASCADE'));
		await tx.execute(sql.raw('DROP SCHEMA IF EXISTS "drizzle" CASCADE'));
	});

	await migrate(database, {
		migrationsFolder: "./db/migrations",
		migrationsSchema: "drizzle",
		migrationsTable: "__drizzle_migrations",
	});
}

try {
	await resetSchemaAndMigrate();
	await seedMockData();
} catch (error) {
	console.error("Failed to seed mock data:", error);
	process.exitCode = 1;
} finally {
	await postgresClient.end();
}
