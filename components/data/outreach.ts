
export interface OutreachActivity {
  year: number;
  date: string;
  title: string;
  location: string;
  description: string;
  type: 'School Visit' | 'University Event' | 'Virtual Event' | 'Fair';
}

export const outreachData: OutreachActivity[] = [
  {
    year: 2024,
    date: 'October 1-2',
    title: 'Uniandes Fest - Labilab',
    location: 'Bogotá, Colombia',
    description: 'Engaged with prospective students and families at the university-wide festival, showcasing hands-on experiments from the Labilab.',
    type: 'University Event',
  },
  {
    year: 2024,
    date: 'October 4',
    title: 'The Impact of Chemical Engineers in Pharmaceuticals',
    location: 'Vermont School, Bogotá (10th Grade)',
    description: 'Presented to 10th-grade students on the crucial role of chemical engineering in developing and manufacturing pharmaceuticals.',
    type: 'School Visit',
  },
  {
    year: 2024,
    date: 'May 4',
    title: 'Family Fest - Labilab',
    location: 'Bogotá, Colombia',
    description: 'Participated in the university\'s Family Fest, demonstrating exciting chemical and food engineering concepts to a general audience.',
    type: 'University Event',
  },
  {
    year: 2023,
    date: 'October 28',
    title: 'Food Engineering: A Design Matinee',
    location: 'Universidad de los Andes Laboratories, Bogotá',
    description: 'Hosted a hands-on workshop for high school students to explore the creative and scientific aspects of food engineering through a design challenge.',
    type: 'University Event',
  },
  {
    year: 2023,
    date: 'May 6',
    title: 'Uniandes Picnic: Taste Food Engineering',
    location: 'Bogotá, Colombia',
    description: 'An interactive session during the Uniandes Picnic event, introducing the science of food engineering in a fun and accessible way.',
    type: 'University Event',
  },
  {
    year: 2022,
    date: 'November 26',
    title: 'Food Engineering: A Design Matinee',
    location: 'Universidad de los Andes Laboratories, Bogotá',
    description: 'Led a design-focused workshop in the university labs, guiding prospective students through the principles of food product development.',
    type: 'University Event',
  },
  {
    year: 2022,
    date: 'October 5',
    title: 'University School Fair',
    location: 'Bogotá, Colombia',
    description: 'Represented the Chemical and Food Engineering department at a major school fair, speaking with students and parents about our programs.',
    type: 'Fair',
  },
  {
    year: 2021,
    date: 'March 15',
    title: 'Virtual Scouting Seminar',
    location: 'Online',
    description: 'Conducted a virtual seminar to recruit prospective students, showcasing the research and academic opportunities in our department.',
    type: 'Virtual Event',
  },
  {
    year: 2020,
    date: 'April 29',
    title: 'Outreach Talk at New Cambridge School',
    location: 'Bucaramanga, Colombia',
    description: 'Visited New Cambridge School to inspire students about careers in engineering and science.',
    type: 'School Visit',
  },
  {
    year: 2020,
    date: 'April 22',
    title: 'Virtual Scouting Seminars',
    location: 'Online',
    description: 'Led a series of online seminars aimed at scouting and recruiting talented high school students during the transition to virtual events.',
    type: 'Virtual Event',
  },
];
