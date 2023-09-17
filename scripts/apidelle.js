// Load environment variables
require('dotenv').config();
const axios = require('axios');
// Import necessary modules from the openai library
const OPENAI_API_KEY = process.env.DALEE_API_KEY;
const { Configuration, OpenAIApi } = require('openai');
async function generateImage() {
  // Configure the OpenAI API client
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Create the image based on the given prompt
  const response = await openai.createImage({
    prompt: 'a white siamese cat',
    n: 1,
    size: '1024x1024',
  });
  image_url = response.data.data[0].url;

  // Extract the image URL from the response
  console.log('Generated Image URL:', image_url);

  return image_url;
}

generateImage().catch((err) => {
  console.error('Error generating image:', err);
});
