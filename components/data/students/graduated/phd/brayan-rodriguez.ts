import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Brayan Rodríguez',
    degree: 'Doctor',
    program: 'Doctor in Engineering',
    graduationYear: 2025,
    startedYear: 2021,
    currentPosition: 'Assistant Professor at Pontificia Universidad Javeriana',
    thesisTitle: 'Listening to Sustainable Bites: Assessing the Influence of Sound on Sustainable Food Perceptions and Behaviors Using a Data-Driven Approach',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "Encouraging consumers to make sustainable food choices is critical, but traditional methods like eco-labels often fall short. This thesis explores a novel approach: using sound to subtly influence perceptions and behaviors around sustainable food."
        },
        {
            question: 'What was the approach?',
            answer: 'This research combined experimental psychology, consumer behavior studies, and machine learning. It investigated how various sounds—from packaging noises to customized music soundscapes and voiceovers—can affect perceptions of health, sustainability, and even the taste of products. A key part of the work was developing a transformer-based deep-learning model to predict flavor associations from instrumental music.'
        },
        {
            question: 'What were the findings?',
            answer: "The study demonstrated that carefully designed sounds can significantly influence consumer choices. For example, packaging sounds can make non-alcoholic beverages more appealing, and specific soundscapes can enhance perceptions of environmental and social sustainability. The research also produced a novel AI-powered music recommendation system that generates playlists based on desired flavor profiles, highlighting the powerful and underexplored role of sound in sustainable marketing."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Brayan%20Rodriguez.JPG',
};

export default student;