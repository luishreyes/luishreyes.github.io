import type { Recognition } from '../../types';
import { teachingData } from './teaching';
import { edcoCoursesData } from './edco';
import { grantsData } from './grants';
import { awardsData } from './awards';
import { editorialData, leadershipRolesData, committeesData } from './institutional';
import { outreachData } from './outreach';
import { studentsData, graduatedStudentsData } from './students';

/**
 * Every headline figure in the portfolio, derived once from the records that
 * already exist. Pages read from here and never compute their own: adding a
 * course to teaching.ts, an award to awards.ts or a grant to grants.ts updates
 * every dashboard that shows it.
 *
 * Two research figures cannot live here. Publication count and citation metrics
 * are fetched at runtime, so pages combine `metrics.research` with what
 * `useAppData()` gives them.
 */

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

// ── Teaching ────────────────────────────────────────────────────────────────

const MOOC_CLIENT = 'Coursera (MOOC)';
const moocCourses = edcoCoursesData.filter((course) => course.client === MOOC_CLIENT);
const inPersonEdco = edcoCoursesData.filter((course) => course.client !== MOOC_CLIENT);

const evaluations = teachingData
  .map((course) => course.evaluation)
  .filter((score): score is number => score !== null);

const courseTitle = (title: string | { en: string; es: string }) =>
  typeof title === 'string' ? title : title.en;

const teaching = {
  firstYear: Math.min(...teachingData.map((course) => course.year)),
  courses: teachingData.length + edcoCoursesData.length,
  universityCourses: teachingData.length,
  continuingEdCourses: edcoCoursesData.length,
  uniqueCourseTitles: new Set([
    ...teachingData.map((course) => courseTitle(course.title)),
    ...edcoCoursesData.map((course) => course.title),
  ]).size,

  // Kept apart on purpose: summed into one figure, MOOC enrolments swamp the
  // rest and the headline reads as classroom students.
  universityStudents: sum(teachingData.map((course) => course.students || 0)),
  continuingEdParticipants: sum(inPersonEdco.map((course) => course.attendees)),
  moocEnrolments: sum(moocCourses.map((course) => course.attendees)),
  moocCompletions: sum(
    moocCourses.map((course) => Math.round(course.attendees * (course.completionRate ?? 0))),
  ),

  /** Mean of the institutional evaluation score across course runs. The scale's
   *  definition is not documented; higher is better and observed values run to
   *  the mid-160s. Null when nothing has been evaluated yet. */
  averageEvaluation: evaluations.length > 0 ? sum(evaluations) / evaluations.length : null,
  evaluatedRuns: evaluations.length,

  educationGrants: grantsData.filter((grant) => grant.area === 'education').length,
};

// ── Research ────────────────────────────────────────────────────────────────

const research = {
  grants: grantsData.length,
  activeGrants: grantsData.filter((grant) => grant.status === 'In Progress').length,
  mentees:
    studentsData.phd.length +
    studentsData.ms.length +
    graduatedStudentsData.phd.length +
    graduatedStudentsData.ms.length,
  graduatedMentees: graduatedStudentsData.phd.length + graduatedStudentsData.ms.length,
};

// ── Service ─────────────────────────────────────────────────────────────────

const service = {
  editorialBoards: editorialData.length,
  leadershipRoles: leadershipRolesData.length,
  committees: committeesData.length,
  outreachActivities: outreachData.length,
};

// ── Recognition ─────────────────────────────────────────────────────────────

/** The graduated-student record with this exact name, if there is one. Used to
 *  state a graduate's current position in one place: testimonials link here
 *  instead of keeping their own copy of the job title. */
export const graduateByName = (name: string) =>
  [...graduatedStudentsData.phd, ...graduatedStudentsData.ms].find(
    (student) => student.name === name,
  );

/** Distinctions that recognize a given role, newest first. */
export const awardsByRole = (role: NonNullable<Recognition['role']>): Recognition[] =>
  awardsData.filter((award) => award.role === role).sort((a, b) => b.year - a.year);

/** The most recent distinction for a role, or undefined if there is none. */
export const flagshipAward = (role: NonNullable<Recognition['role']>): Recognition | undefined =>
  awardsByRole(role)[0];

export const metrics = { teaching, research, service };
