import axios from 'axios';

//give this data to the job controller...
const aiController = {
    handleResumeQuery: async (req, res) => {
        const { resume, query } = req.body;

        try {
            // Call OpenAI API with the resume and query
            const response = await axios.post('https://api.openai.com/v1/your-endpoint', {
                prompt: `Resume: ${resume}\nQuery: ${query}`,
                // Add other parameters as needed
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            // Send the response back to the client
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default aiController; 

