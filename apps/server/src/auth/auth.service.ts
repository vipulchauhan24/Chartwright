import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity';

const identityPoolId = 'ap-south-1:19fd0fac-1d23-4626-a81d-83f3594fbc9d'; // Replace with your Identity Pool ID
const region = 'ap-south-1'; // Replace with your AWS region

@Injectable()
export class AuthService {
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
        'Internal server error.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
