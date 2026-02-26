import { departmentsTable } from "@/db/tables/departments";
import { QueryParameters } from "../request-handling/common";
import { OrmResult } from "../error/orm-error";
import { database } from "@/db/setup/query-postgres";
import { newDatabaseTransaction } from "./common";
import { Department } from "../response-handling/departments";

export const selectDepartments = async (
    parameters: QueryParameters,
): Promise<OrmResult<Department[]>> => {
    return await newDatabaseTransaction(database, async (tx) => {
        const departments = await tx
            .select({
                id: departmentsTable.id,
                city: departmentsTable.city,
            })
            .from(departmentsTable)
            .limit(parameters.limit)
            .offset(parameters.offset);

        return departments;
    });
};

