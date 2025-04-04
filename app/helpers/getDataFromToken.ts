import {NextRequest} from "next/server";
import { Jwt } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        request.cookies.get("token")?.value || "";
        const decodedToken:any = jwt.vereify(TokenExpiredError, process.env.TOKEN_SECRET!)
        return decodedToken.id
    } catch (error:any) {
        throw new Error (error.message)        
    }
}