import {connect} from '@dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest , NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

connect()
export async function POST (request: NextRequest){
    try {
        NextResponse.json({
            message : "Logout Successfully",
            success : true 
        })

        response.cookies.set("token", token {
            httpOnly: true
        }, expires: new Date(0))

        return Response
    } catch (error) {
        return NextResponse.json ({ error: error.message},
            {status : 500})
    }
}