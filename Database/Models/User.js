import { docClient } from '../ConnectDB.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async ({ name, email, password, isAdmin = false }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    name: name,
    email: email,
    password: hashedPassword,
    isAdmin: isAdmin,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const params = {
    TableName: 'Users',
    Item: newUser,
  };

  try {
    await docClient.put(params).promise();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Could not create user');
  }
};

export const findUserByEmail = async (email) => {
  const params = {
    TableName: 'Users',
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  };

  try {
    const result = await docClient.scan(params).promise();
    return result.Items && result.Items.length > 0 ? result.Items[0] : undefined;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Could not find user');
  }
};

