import NextAuth from "next-auth/next";

declare module 'next-auth'{
    export interface User{
        id: string
        name: string
        email: string
        username: string
        avatar_url: string
    }

    //ao criar uma nova interface session a original (do next-auth) não está sendo substituida, mas sim estendida com mais elementos 
    interface Session {
        user: User
    }
}