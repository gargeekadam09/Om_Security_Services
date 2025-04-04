import {connect} from '@dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest , NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const {token} = reqBody
        console.log(token);

        await user.findOne({verifyToken :token,
            verifyTokenExpiry: {$gt: Date.now()}})

            if (!user) {
                return NextResponse.json ({error: "Invalid
                    token"}, {status : 400})
            }
            console.log(user); 

            user.isVerified = true
            user.verifyToken = undefined
            user.verifyTokenExpiry = undefined

            await.user.save()

            return NextResponse.json ({
                message: "Email Verified Succesfully",
                success : true
            } {status : 500})
        
    } catch (error:any) {
     return NextResponse.json ({error : error.message},
     {status : 500})
      }        
    }
