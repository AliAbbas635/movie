import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './config.env' });

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create DynamoDB service object
const dynamoDb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Function to test connection
export const ConnectDb = async () => {
  try {
    // List tables as a way to test the connection
    const data = await dynamoDb.listTables().promise();
    console.log("Connected to DynamoDB. Tables:", data.TableNames);
  } catch (error) {
    console.error("Error connecting to DynamoDB:", error);
  }
};

export { dynamoDb, docClient };
