
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { Constants } from "../../Utility/Constants";
import { JWTAccessPayloType } from "../../Utility/Jwt";

interface ConnectionAdapter {

  getToken(): string | undefined;

  setUser(payload: JWTAccessPayloType): void;

  getError(message: string): Error;
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly Jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private GetConnectionAdapter(context: ExecutionContext,): ConnectionAdapter {
    const type = context.getType();

    if (type === "http") {

      const req = context.switchToHttp().getRequest();


      return {

        getToken: () => {

          const [scheme, token] =
            req.headers.authorization?.split(" ") ?? [];

          if (scheme !== "Bearer") {
            return undefined;
          }

          return token;
        },


        setUser: (payload) => {

          req[Constants.CurrentUserKey] = payload;

        },


        getError: (message) => {

          return new UnauthorizedException(message);

        },

      };
    }

    if (type === "ws") {
      const socket =context.switchToWs().getClient<Socket>();

      return {

        getToken: () => {

          const [scheme, token] =
            socket.handshake.headers.authorization?.split(" ") ?? [];

          if (scheme !== "Bearer") {
            return undefined;
          }

          return token;
        },

        setUser: (payload) => {

          socket.data[Constants.CurrentUserKey] = payload;

        },

        getError: (message) => {

          return new WsException(message);

        },

      };
    }

    throw new UnauthorizedException("Unsupported Connection Type",);
  }

  async canActivate(context: ExecutionContext,): Promise<boolean> {


    const connection = this.GetConnectionAdapter(context);
    const token      = connection.getToken();

    if (!token) {
      throw connection.getError("No Token Provided",);
    }

    let payload: JWTAccessPayloType;

    try {

      payload =await this.Jwt.verifyAsync<JWTAccessPayloType>(token,{secret:this.config.get<string>("ACCESS_TOKEN_SECRET",),},);

    } catch {
      throw connection.getError("Invalid Token",);
    }

    connection.setUser(payload);

    return true;
  }
}

