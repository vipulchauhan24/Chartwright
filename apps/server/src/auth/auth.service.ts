import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity';
import { SERVER_ERROR_MESSAGES, TABLE_NAME } from '../lib/constants';

const identityPoolId = 'ap-south-1:19fd0fac-1d23-4626-a81d-83f3594fbc9d'; // Replace with your Identity Pool ID
const region = 'ap-south-1'; // Replace with your AWS region

@Injectable()
export class AuthService {
  constructor(@Inject('DATABASE_CONNECTION') private db: any) {}

  async signinAsGuest() {
    try {
      const client = new CognitoIdentityClient({ region });

      // Step 1: Get an Identity ID for the guest user
      const getIdCommand = new GetIdCommand({ IdentityPoolId: identityPoolId });
      const identityResponse = await client.send(getIdCommand);
      const identityId = identityResponse.IdentityId;

      // Step 2: Get temporary AWS credentials
      const getCredentialsCommand = new GetCredentialsForIdentityCommand({
        IdentityId: identityId,
      });
      const credentialsResponse = await client.send(getCredentialsCommand);

      return credentialsResponse.Credentials;
    } catch (error) {
      console.error('Guest sign-in error:', error);
      throw new HttpException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async signinAsUser(params: {
    email: string;
    cognito_id: string;
    created_date: string;
  }) {
    try {
      const { email, cognito_id, created_date } = params;
      const user = await this.db.execute(
        `SELECT * FROM ${TABLE_NAME.USERS} WHERE cognito_id = '${cognito_id}';`
      );

      if (user.length) {
        // let billingDetails = await this.db.execute(
        //   `SELECT * FROM ${TABLE_NAME.BILLING} WHERE user_id = '${user[0].id}';`
        // );
        // if (!billingDetails || !billingDetails.length) {
        //   billingDetails = await this.db.execute(
        //     `INSERT INTO ${TABLE_NAME.BILLING} (user_id, plan, status, created_date) VALUES ('${user[0].id}', 'free', 'active', '${created_date}');`
        //   );
        // }
        return user[0];
      }

      return await this.db.execute(
        `INSERT INTO ${TABLE_NAME.USERS} (user_name, email, cognito_id, created_date) VALUES ('${email}', '${email}', '${cognito_id}', '${created_date}');`
      );
    } catch (error) {
      console.error('User sign-in error:', error);
      throw new HttpException(
        SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
