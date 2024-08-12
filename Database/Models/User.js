import { docClient } from '../ConnectDB.js';

export const findUserByEmail = async (email) => {
  const params = {
    TableName: 'Users',
    IndexName: 'email-index', // Make sure this matches the actual name of your GSI
    KeyConditionExpression: 'email = :email', // Query by the email partition key
    ExpressionAttributeValues: {
      ':email': email,
    },
  };

  try {
    const result = await docClient.query(params).promise();
    return result.Items && result.Items.length > 0 ? result.Items[0] : undefined;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Could not find user');
  }
};
