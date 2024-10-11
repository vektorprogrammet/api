import { database } from "@db/setup/queryPostgres";
import {usersSchema, User, NewUser } from "@db/schema/users";
import {eq} from "drizzle-orm";
import { catchDatabase, DatabaseResult } from "@src/error/dbErrors";

export const getUsersFromId = async (id: number): Promise<DatabaseResult<User[]>> => {
    return catchDatabase(async () => {
        return await database
            .select()
            .from(usersSchema)
            .where(eq(usersSchema.id, id));
    });
};
export const insertUsers = async (users: NewUser[]): Promise<DatabaseResult<User[]>> => {
    return catchDatabase(async () => {
        return await database
        .insert(usersSchema)
        .values(users)
        .returning();
    });
};