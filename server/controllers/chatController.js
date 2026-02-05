const Groq = require('groq-sdk');
const pdfParseLib = require('pdf-parse');
const PDFParseClass = typeof pdfParseLib === 'function' ? pdfParseLib : (pdfParseLib.default || pdfParseLib.PDFParse);

// Wrapper to handle the Class-based library
const pdfParse = async (buffer) => {
    try {
        const instance = new PDFParseClass(buffer);
        return {
            text: instance.text || "",
            info: instance.info,
            metadata: instance.metadata,
            version: instance.version
        };
    } catch (e) {
        console.error("PDF Parsing Error:", e);
        throw e;
    }
};

const apiKey = process.env.GROQ_API_KEY;

let groq;
if (apiKey) {
    groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
} else {
    console.warn("WARNING: GROQ_API_KEY is missing. Chat features will be disabled.");
}

exports.chatResponse = async (req, res) => {
    const { message } = req.body;
    const file = req.file;

    try {
        let model = 'llama-3.3-70b-versatile';
        let messages = [
            {
                role: 'system',
                content: 'You are a helpful academic assistant for EdTrack. You help students with their studies, assignments, and finding resources.'
            }
        ];

        let userContent = message || "";

        // Handle File Uploads
        if (file) {
            if (file.mimetype === 'application/pdf') {
                // PDF Handling
                try {
                    const pdfData = await pdfParse(file.buffer);
                    const pdfText = pdfData.text.slice(0, 20000); // Truncate to avoid token limits
                    userContent += `\n\n[Context from uploaded PDF]:\n${pdfText}`;
                    messages.push({ role: 'user', content: userContent });
                } catch (pdfError) {
                    console.error("PDF Parse Error Details:", {
                        message: pdfError.message,
                        stack: pdfError.stack,
                    });
                    return res.status(422).json({ reply: "I couldn't read the text from that PDF. It might be a scanned image/document which is not supported." });
                }

            } else if (file.mimetype.startsWith('image/')) {
                // Image Handling (Vision)
                model = 'meta-llama/llama-4-scout-17b-16e-instruct';

                // Convert buffer to base64
                const base64Image = file.buffer.toString('base64');
                const imageUrl = `data:${file.mimetype};base64,${base64Image}`;

                messages = [
                    {
                        role: 'user',
                        content: [
                            { type: "text", text: userContent || "Analyze this image." },
                            { type: "image_url", image_url: { url: imageUrl } }
                        ]
                    }
                ];
            } else {
                messages.push({ role: 'user', content: userContent });
            }
        } else {
            messages.push({ role: 'user', content: userContent });
        }

        if (!groq) {
            return res.status(503).json({ reply: "AI features are not configured on this server." });
        }

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: model,
        });

        const reply = completion.choices[0]?.message?.content || "I couldn't generate a response.";
        res.json({ reply });

    } catch (error) {
        console.error('Groq API Error:', error);

        // Fallback to Mock Response if API fails (e.g., Invalid Key, Rate Limit, Network)
        // This ensures the demo app continues to function even without a valid backend AI service.
        console.log("Falling back to Mock AI Response due to error.");

        return res.json({
            reply: "I'm currently in 'Offline Mode' because I couldn't connect to my AI brain (API Key issue). \n\nHere is a simulated response: \n\nBased on your query, I recommend checking the lecture notes in the 'Resources' section. Accessing the timetable will also help you plan your study sessions effectively. If you need specific help with a subject, please contact your course instructor."
        });
    }
};
