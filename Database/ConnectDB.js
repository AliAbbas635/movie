import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

// Check if essential environment variables are set
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
  throw new Error('Missing essential AWS environment variables.');
}

// Configure AWS SDK
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION || 'us-east-1', // Set a default region if not provided
});

// Create DynamoDB service object
const dynamoDb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Function to test connection
export const connectToDb = async () => {
  try {
    // List tables as a way to test the connection
    const data = await dynamoDb.listTables().promise();
    console.log("Connected to DynamoDB. Tables:", data.TableNames);
  } catch (error) {
    console.error("Error connecting to DynamoDB:", error);
    throw new Error('Failed to connect to DynamoDB');
  }
};

export { dynamoDb, docClient };
