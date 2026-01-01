//database user actions
"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { userType } from "@/types/user";

export const getData = async() =>{
    const users = await db.select().from(userTable);
    return users;
}

export const addUser = async (userData: userType) => {
    const userExists = await db.select().from(userTable).where(eq(userTable.email, userData.email)).limit(1);
    if(userExists.length > 0){
        return userExists[0];
    }
    const {name, email} = userData;
    await db.insert(userTable).values({
        name,
        email,
    })
}

export const getUserByEmail = async(email: string) =>{
    const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
    return user[0];
}