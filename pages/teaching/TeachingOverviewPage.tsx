import React, { useRef } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { StatsSection } from '../../components/StatsSection';
import { teachingData, type TaughtCourse } from '../../components/data/teaching';
import { edcoCoursesData } from '../../components/data/edco';
import { CoursesOverTimeChart } from '../../components/CoursesOverTimeChart';
import { motion, useScroll, useTransform } from 'framer-motion';

// Calculate stats from data
const universityCoursesCount = teachingData.length;
const edcoCoursesCount = edcoCoursesData.length;
const totalCourses = universityCoursesCount + edcoCoursesCount;

const universityStudentsCount = teachingData.reduce((sum, course) => sum + (course.students || 0), 0);
const edcoStudentsCount = edcoCoursesData.reduce((sum, course) => sum + course.attendees, 0);
const totalStudents = universityStudentsCount + edcoStudentsCount;

// Note: Averaging mixed scales (e.g. 5.0 and 200.0) isn't perfectly meaningful 
// but we keep a generic metric for now.
const evaluations = teachingData
    .map(c => c.evaluation)
    .filter((e): e is number => e !== null);

const averageEvaluation = evaluations.length > 0
    ? (evaluations.reduce((sum, e) => sum + e, 0) / evaluations.length)
    : null;
    
const averageEvaluationDisplay = averageEvaluation !== null
    ? averageEvaluation.toFixed(1)
    : 'N/A';
    
const uniqueCourses = new Set([...teachingData.map(c => c.title), ...edcoCoursesData.map(c => c.title)]).size;

const stats = [
    { label: 'Total Courses Taught', value: totalCourses },
    { label: 'Total Students', value: totalStudents },
    { label: `Avg. Evaluation Score`, value: averageEvaluationDisplay },
    { label: 'Unique Course Titles', value: uniqueCourses },
    { label: 'University Courses', value: universityCoursesCount },
    { label: 'Continuing Ed. Courses', value: edcoCoursesCount },
];

export const TeachingOverviewPage: React.FC = () => {
  // Map continuing education courses to the TaughtCourse type for the chart
  const mappedEdcoCourses: TaughtCourse[] = edcoCoursesData.map(course => {
    let courseType: TaughtCourse['type'] = 'EDCO';
    if (course.type === 'Corporate Course') {
      courseType = 'Corporate';
    } else if (course.client === 'Coursera (MOOC)') {
      courseType = 'Coursera';
    }

    return {
      term: `${course.year}-EDCO`,
      year: course.year,
      code: 'EDCO',
      title: course.title,
      students: course.attendees,
      type: courseType,
      evaluation: null,
      level: null,
    };
  });

  const allCourses = [...teachingData, ...mappedEdcoCourses];

  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"]
  });
  const frameRotate = useTransform(scrollYProgress, [0, 1], [1, -2]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  return (
    <PageWrapper noPadding>
      {/* Header Section */}
      <div ref={headerRef} className="relative bg-zinc-800 overflow-hidden p-6 sm:p-8">
        {/* Dephased frame */}
        <motion.div
          className="absolute inset-2 sm:inset-4 rounded-2xl border-2 border-yellow-400 pointer-events-none"
          style={{ rotate: frameRotate }}
        />

        {/* Main content with image background */}
        <motion.div
          className="relative rounded-2xl shadow-xl z-10 overflow-hidden"
          style={{ rotate: imageRotate }}
        >
          <img 
              src="https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/04.png" 
              alt="A professor engaging with students in a modern, collaborative classroom setting at Uniandes"
              className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"></div>
          <div className="absolute inset-0 bg-zinc-900/60 mix-blend-multiply" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-24">
              <motion.div
                  // FIX: Spread motion props to avoid TypeScript type errors.
                  {...{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.6, ease: 'easeOut' },
                  }}
                  className="text-left max-w-3xl"
              >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                      Teaching Overview
                  </h1>
                  <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                      Fostering the next generation of innovators through project-based learning and real-world challenges.
                  </p>
              </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <StatsSection stats={stats} isLoading={false} />

            <motion.div 
              // FIX: Spread motion props to avoid TypeScript type errors.
              {...{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.5, delay: 0.2 },
              }}
              className="mt-16 max-w-4xl mx-auto text-center"
            >
              <h2 className="text-2xl font-semibold text-brand-dark">My Teaching Approach</h2>
              <p className="mt-4 text-brand-gray leading-relaxed text-lg">
                My teaching portfolio reflects a deep commitment to engineering education across all levels, from core undergraduate courses to specialized graduate seminars and professional development programs. My courses are designed to be dynamic, hands-on learning environments where students tackle real-world challenges. I emphasize a project-based approach that not only builds strong technical foundations but also cultivates essential professional skills like critical thinking, teamwork, and communication. Through my involvement in curriculum design, continuing education, and corporate training, I strive to create impactful learning experiences that bridge the gap between academic theory and industry practice, empowering the next generation of engineers to innovate and lead.
              </p>
            </motion.div>
            
            <motion.div
              // FIX: Spread motion props to avoid TypeScript type errors.
              {...{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.5, delay: 0.2 },
              }}
              className="mt-20"
            >
              <CoursesOverTimeChart courses={allCourses} />
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};
