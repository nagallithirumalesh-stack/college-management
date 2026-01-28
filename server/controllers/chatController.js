const Groq = require('groq-sdk');

const apiKey = process.env.GROQ_API_KEY; // Ensure this is set in .env

const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Sometimes needed if environment detection is weird, though this is server side.
});

exports.chatResponse = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful academic assistant for the Smart Digital Campus. You help students with their studies, assignments, and finding resources.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'llama-3.3-70b-versatile', // Verified working model
        });

        const reply = completion.choices[0]?.message?.content || "I couldn't generate a response.";
        res.json({ reply });

    } catch (error) {
        console.error('Groq API Error:', error.message);

        // Fallback for demo purposes if API fails (e.g., invalid key, network)
        const mockReplies = [
            "That's an interesting question about your studies.",
            "I recommend checking the lecture notes in the Subject channel.",
            "Make sure to review the syllabus for the upcoming exam.",
            "You can find more resources in the library section.",
            "Could you clarify which subject you are asking about?"
        ];
        const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];

        res.json({
            reply: `(AI Offline, Mock Response): ${randomReply}`,
            error: "Service unavailable, switched to offline mode."
        });
    }
};
