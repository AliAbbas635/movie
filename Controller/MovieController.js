import { s3Client, bucketName } from './S3Client.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { docClient } from '../Database/ConnectDB.js';

// UPDATE Movie
export const UpdateMovie = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the user is an admin
    const userParams = {
      TableName: 'Users',
      Key: {
        id: userId,
      },
    };

    const userResult = await docClient.get(userParams).promise();

    if (!userResult.Item || !userResult.Item.isAdmin) {
      return res.status(403).json('You are not allowed!');
    }

    // Prepare the update parameters
    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        id: req.params.id,
      },
      UpdateExpression: 'set ' + Object.keys(req.body).map((key, idx) => `#${key} = :${key}`).join(', '),
      ExpressionAttributeNames: Object.keys(req.body).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
      ExpressionAttributeValues: Object.keys(req.body).reduce((acc, key) => ({ ...acc, [`:${key}`]: req.body[key] }), {}),
      ReturnValues: 'ALL_NEW',
    };

    // Update the movie in DynamoDB
    const result = await docClient.update(updateParams).promise();

    res.status(200).json(result.Attributes);
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json('Internal server error');
  }
};

// DELETE Movie
export const DeleteMovie = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the user is an admin
    const userParams = {
      TableName: 'Users',
      Key: {
        id: userId,
      },
    };

    const userResult = await docClient.get(userParams).promise();

    if (!userResult.Item || !userResult.Item.isAdmin) {
      return res.status(403).json('You are not allowed!');
    }

    // Find the movie by ID in DynamoDB
    const movieParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        id: req.params.id,
      },
    };

    const movieResult = await docClient.get(movieParams).promise();

    if (!movieResult.Item) {
      return res.status(404).json('Movie not found');
    }

    const movie = movieResult.Item;

    // Extract filenames from URLs and delete files from S3
    const videoFilename = movie.video ? movie.video.split('/').pop() : null;
    const imageFilename = movie.image ? movie.image.split('/').pop() : null;

    if (videoFilename) await deleteFileFromS3(videoFilename);
    if (imageFilename) await deleteFileFromS3(imageFilename);

    // Delete the movie from DynamoDB
    await docClient.delete(movieParams).promise();

    res.status(200).json('The movie has been deleted...');
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json('Internal server error');
  }
};


// Helper function to delete a file from S3
const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    throw new Error('Error deleting file from S3');
  }
};


// GET - Search for movies by title (case-insensitive)
export const SearchMovie = async (req, res) => {
  const { title } = req.query;

  try {
    if (!title) {
      return res.status(400).json({ message: 'Title query parameter is required' });
    }

    // Convert the title query to lowercase for case-insensitive comparison
    const lowerCaseTitle = title.toLowerCase();

    // Define the parameters for the scan operation
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: 'contains(#lowercaseTitle, :title)',
      ExpressionAttributeNames: {
        '#lowercaseTitle': 'lowercaseTitle', // Alias to avoid reserved word issues
      },
      ExpressionAttributeValues: {
        ':title': lowerCaseTitle, // The lowercase value to search for
      },
    };

    // Scan the table with the filter
    const data = await docClient.scan(params).promise();
    const movies = data.Items;

    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found with that title.' });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error searching for movie:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET RANDOM Movie
export const RandomMovie = async (req, res) => {
  const type = req.query.type;
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };

  if (type) {
    params.FilterExpression = 'isSeries = :isSeries';
    params.ExpressionAttributeValues = { ':isSeries': type === 'series' };
  }

  try {
    let data = await docClient.scan(params).promise();
    let movies = data.Items;

    // If no movies found with the specified type, fallback to fetching any movie
    if (movies.length === 0) {
      console.log('No movies found with the specified type. Fetching any random movie.');
      delete params.FilterExpression;
      delete params.ExpressionAttributeValues;
      data = await docClient.scan(params).promise();
      movies = data.Items;
    }

    // If still no movies found, return an error
    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found in the database' });
    }

    // Select a random movie from the available movies
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];

    res.status(200).json(randomMovie);
  } catch (err) {
    console.error('Error fetching random movie:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET RANDOM 50 Movies
export const RandomFiftyMovie = async (req, res) => {
  const type = req.query.type;
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };

  if (type) {
    params.FilterExpression = 'isSeries = :isSeries';
    params.ExpressionAttributeValues = { ':isSeries': type === 'series' };
  }

  try {
    const result = await docClient.scan(params).promise();

    if (result.Items) {
      // Shuffle the array to get random movies
      const shuffledMovies = result.Items.sort(() => 0.5 - Math.random());

      // Get the first 50 movies from the shuffled array
      const selectedMovies = shuffledMovies.slice(0, 50);

      res.status(200).json(selectedMovies);
    } else {
      res.status(404).json({ message: 'No movies found' });
    }
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET ALL MOVIES
export const AllMovies = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const userParams = {
      TableName: 'Users', 
      Key: {
        id: userId, 
      },
    };

    

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME, 
    };

    const moviesResult = await docClient.scan(params).promise();
    const movies = moviesResult.Items;

    res.status(200).json(movies.reverse());
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json('Internal Server Error');
  }
};

// UPLOAD MOVIE
export const UploadMovie = async (req, res) => {
  try {
    console.log('Files:', req.files);  
    console.log('Body:', req.body);    
    if (!req.files) {
      console.log('No file uploaded');
      return res.status(400).send('No file uploaded');
    }

    const { title, desc, genre, limit, isSeries } = req.body;
    const movieId = uuidv4(); // Generate a unique ID for the movie

    // Upload video file to S3
    const videoFile = req.files.video[0].buffer;
    const videoFileName = `${movieId}-${req.files.video[0].originalname}`;
    const videoUrl = await uploadFileToS3(videoFile, videoFileName, req.files.video[0].mimetype);

    // Upload image (movie poster) to S3
    const imageFile = req.files.image[0].buffer;
    const imageFileName = `${movieId}-${req.files.image[0].originalname}`;
    const imageUrl = await uploadFileToS3(imageFile, imageFileName, req.files.image[0].mimetype);

    // Convert title to lowercase before storing in the database
    const lowerCaseTitle = title.toLowerCase();

    // Prepare movie data for DynamoDB
    const movieData = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        id: movieId,
        title: lowerCaseTitle,  // Store the title in lowercase
        desc: desc,
        genre: genre,
        image: imageUrl,
        imgTitle: imageFileName,
        video: videoUrl,
        limit: limit,
        isSeries: isSeries === 'true', 
      },
    };

    // Save movie data to DynamoDB
    await docClient.put(movieData).promise();

    res.status(200).json({ message: 'Movie uploaded and stored successfully', movie: movieData.Item });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};

// Helper function to upload a file to S3
const uploadFileToS3 = async (buffer, key, mimeType) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    throw new Error('Error uploading file to S3');
  }
};

// GET MOVIE STATS
export const MovieStats = async (req, res) => {
  try {
    const params = {
      TableName: 'Movies',
    };

    const result = await docClient.scan(params).promise();
    const movies = result.Items;

    // Aggregate movies by genre
    const genreStats = movies.reduce((acc, movie) => {
      const genre = movie.genre || 'Unknown';
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    // Convert genreStats object to an array for easier consumption
    const genreStatsArray = Object.keys(genreStats).map((genre) => ({
      genre,
      total: genreStats[genre],
    }));

    res.status(200).json(genreStatsArray);
  } catch (error) {
    res.status(500).json(error);
  }
};
