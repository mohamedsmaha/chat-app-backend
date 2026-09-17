import { createParamDecorator , ExecutionContext } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/internal";
import { Constants } from "../../Utility/Constants";
import { JWTAccessPayloType } from "../../Utility/Jwt";

export const CurrentUser = createParamDecorator(
    (data , context :ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const payload : JWTAccessPayloType = request[Constants.CurrentUserKey]
        return payload;
    }
)