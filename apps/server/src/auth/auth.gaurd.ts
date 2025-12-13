import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { subscriptionPlans, users, userSubscriptions } from '../db/db.schema';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private authService: AuthService,
    @Inject(DRIZZLE_PROVIDER)
    private db: NodePgDatabase
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header'
      );
    }

    const token = authHeader.substring(7);
    const user = await this.authService.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach user to request
    (request as any).user = user;

    if (!(request as any).user?.userDbId) {
      const userDetails = await this.db
        .select({
          id: users.id,
          userName: users.userName,
          email: users.email,
          superUser: users.superUser,
          userPrivileges: users.userPrivileges,
          userStatus: userSubscriptions.userStatus,
          userPlan: subscriptionPlans.userPlan,
        })
        .from(users)
        .fullJoin(userSubscriptions, eq(users.id, userSubscriptions.userId))
        .fullJoin(
          subscriptionPlans,
          eq(userSubscriptions.planId, subscriptionPlans.id)
        );

      if (userDetails.length) {
        (request as any).user.userDbId = userDetails[0].id;
        (request as any).user.userStatus = userDetails[0].userStatus;
        (request as any).user.userPlan = userDetails[0].userPlan;
        (request as any).user.superUser = userDetails[0].superUser;
      } else {
        throw new UnauthorizedException('User not found!');
      }
    }
    return true;
  }
}
