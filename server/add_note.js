
const { Note } = require('./models');
const sequelize = require('./config/database');

async function addNote() {
    try {
        await sequelize.authenticate();

        await Note.create({
            title: "Intro to AI - Unit 1",
            description: "Basics of AI and Agents",
            fileUrl: "uploads/ai_unit1.pdf", // Dummy path
            fileType: "pdf",
            subjectId: 11,
            unit: 1,
            uploadedById: 19, // Shaheen
            isPublic: true
        });

        console.log("Created note for Subject 11");

    } catch (err) {
        console.error(err);
    }
}

addNote();
