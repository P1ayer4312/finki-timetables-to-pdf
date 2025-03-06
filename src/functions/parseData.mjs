/** @typedef {import("../types/types.mjs").StudyProgram} StudyProgram */
/** @typedef {import("../types/types.mjs").Weekdays} Weekdays */
import parseLessons from "./parseLessons.mjs";

export default function parseData(data) {
  const lessons = parseLessons(data);
  const studiesTables = data.r.dbiAccessorRes.tables;

  /** @type {StudyProgram[]} */
  const parsedData = [];

  /** @type {Weekdays[]} */
  const weekdaysTemplate = [];

  // Map days
  const days = studiesTables.find((el) => el.id === "days");

  days.data_rows.forEach((el) => {
    weekdaysTemplate.push({
      dayId: el.id,
      dayName: el.short,
      lessons: [],
    });
  });

  // Map classes
  const classes = studiesTables.find((el) => el.id === "classes");

  classes.data_rows.forEach((el) => {
    const weekdays = structuredClone(weekdaysTemplate);
    const classLessons = lessons.filter((item) => item.classIds.includes(el.id));

    for (let day of weekdays) {
      day.lessons = classLessons
        .filter((item) => item.dayNum === day.dayId)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    parsedData.push({
      studyId: el.id,
      studyName: el.short,
      weekdays,
    });
  });

  // Sort by year
  parsedData.sort((a, b) => a.studyName.localeCompare(b.studyName));

  return parsedData;
}
