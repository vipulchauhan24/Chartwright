import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SERVER_ERROR_MESSAGES } from '../lib/constants';
import { subscriptionPlans, users, userSubscriptions } from '../db/db.schema';
import { DRIZZLE_PROVIDER } from '../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
// import {
//   CognitoIdentityProviderClient,
//   GetUserCommand,
// } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';

const { COGNITO_USER_POOL_ID, VITE_CLIENT_ID } = process.env;

@Injectable()
export class AuthService {
  private _verifier: CognitoJwtVerifierSingleUserPool<{
    userPoolId: string;
    tokenUse: 'access';
    clientId: string;
  }>;
  // private _cognitoClient: CognitoIdentityProviderClient;

  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: NodePgDatabase
  ) {
    this._verifier = CognitoJwtVerifier.create({
      userPoolId: `${COGNITO_USER_POOL_ID}`,
      tokenUse: 'access',
      clientId: `${VITE_CLIENT_ID}`,
    });
    // this._cognitoClient = new CognitoIdentityProviderClient({
    //   region: AWS_REGION,
    // });
  }

  async verifyToken(token: string) {
    try {
      const payload = await this._verifier.verify(token);
      return { username: payload.username, sub: payload.sub };
    } catch {
      return null;
    }
  }

  // async getUserAttributes(accessToken: string) {
  //   const command = new GetUserCommand({ AccessToken: accessToken });
  //   const response = await this._cognitoClient.send(command);
  //   return response.UserAttributes;
  // }

  async login(params: {
    email: string;
    cognitoId: string;
    createdDate: string;
  }) {
    try {
      const { email, cognitoId, createdDate } = params;

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

      const userData = userDetails[0]; //TBD - strict type def.

      if (userData?.id) {
        return { status: HttpStatus.OK, userData: userData };
      }

      let result: {
        id: string;
        userName: string;
        email: string;
        superUser: boolean | null;
        userPrivileges: (
          | 'exports_embed_image_5'
          | 'exports_embed_image_unlimited'
          | 'exports_embed_iframe_5'
          | 'exports_embed_iframe_unlimited'
          | 'save_as_pdf_unlimited'
          | 'save_as_image_unlimited'
          | 'save_charts_10'
          | 'save_charts_unlimited'
        )[];
      }[] = [];

      await this.db.transaction(async (tx) => {
        tx.insert(users).values({
          userName: email,
          email: email,
          cognitoId: cognitoId,
          createdDate: createdDate,
        });
        result = await tx
          .insert(users)
          .values({
            userName: email,
            email: email,
            cognitoId: cognitoId,
            createdDate: createdDate,
          })
          .returning({
            id: users.id,
            userName: users.userName,
            email: users.email,
            superUser: users.superUser,
            userPrivileges: users.userPrivileges,
          });

        const freeSubscriptionPlanDetails = await this.db
          .select({ id: subscriptionPlans.id })
          .from(subscriptionPlans)
          .where(eq(subscriptionPlans.userPlan, 'FREE')); // default subscription on signup.

        if (!freeSubscriptionPlanDetails.length) {
          throw new Error('Subscription plan not found!');
        }

        await tx.insert(userSubscriptions).values({
          userId: result[0].id,
          planId: freeSubscriptionPlanDetails[0].id,
          createdDate: createdDate,
        });
      });

      if (!result.length) {
        throw new Error('Save failed!');
      }
      return {
        status: HttpStatus.CREATED,
        userData: { ...result[0], userStatus: 'ACTIVE', userPlan: 'FREE' },
      };
    } catch (error) {
      console.error('User login error:', error);
      throw new HttpException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
