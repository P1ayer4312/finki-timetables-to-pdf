/**
 * @typedef {object} StudyProgram
 * @prop {string} studyId
 * @prop {string} studyName
 * @prop {Weekdays[]} weekdays
 *
 * @typedef {object} Weekdays
 * @prop {string} dayId
 * @prop {string} dayName
 * @prop {ParsedLessons[]} lessons
 *
 * @typedef {object} ParsedLessons
 * @prop {string} id
 * @prop {string} subjectId
 * @prop {string} subjectName
 * @prop {string[]} teachersNames
 * @prop {string[]} classIds
 * @prop {string[]} classIdsNames
 * @prop {string} dayNum
 * @prop {string} startTime
 * @prop {string} endTime
 * @prop {string[]} groupNames
 * @prop {string[]} rooms
 * @prop {string[]} teacherColors
 *
 * @typedef {object} PreviousTimetables
 * @prop {string} tt_num Timetable number
 * @prop {string} text Timetable name
 *
 * @typedef {object} TimetableNums
 * @prop {string} current Current ongoing semester timetable number
 * @prop {PreviousTimetables[]} other Previous and current timetables
 *
 * @typedef {import("pdfmake/interfaces").TDocumentDefinitions} TDocumentDefinitions
 */

export default {};
