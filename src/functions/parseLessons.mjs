/** @typedef {import("../types/types.mjs").ParsedLessons} ParsedLessons */

export default function parseLessons(data) {
  // This'll be messy
  const studiesTables = data.r.dbiAccessorRes.tables;
  const classrooms = studiesTables.find((el) => el.id === "classrooms").data_rows;
  const subjects = studiesTables.find((el) => el.id === "subjects").data_rows;
  const teachers = studiesTables.find((el) => el.id === "teachers").data_rows;
  const lessons = studiesTables.find((el) => el.id === "lessons").data_rows;
  const classes = studiesTables.find((el) => el.id === "classes").data_rows;
  const periods = studiesTables.find((el) => el.id === "periods").data_rows;
  const cards = studiesTables.find((el) => el.id === "cards").data_rows;

  /** @type {ParsedLessons[]} */
  const parsedLessons = [];

  lessons.forEach((el) => {
    const subjectName = subjects.find((item) => item.id === el.subjectid);
    const teacherColors = [];
    const teachersNames = el.teacherids.map((teacherId) => {
      const teacher = teachers.find((item) => item.id === teacherId);
      teacherColors.push(teacher.color);
      return teacher.short;
    });

    const classesData = classes.filter((item) => el.classids.includes(item.id)).map((item) => item.short);
    const card = cards.find((item) => item.lessonid === el.id);

    const rooms = card.classroomids.map((classroomId) => {
      const room = classrooms.find((room) => classroomId === room.id);
      return room.name;
    });

    let startPeriodId = card.period;
    let endPeriodId;
    for (let n = 1; n <= el.count; n++) {
      // From what I noticed, if there's only one lesson object present, but the "count"
      // is greater than 1, it adds additional cards below the first lesson card
      const period = periods.find((item) => item.id === startPeriodId);

      let endPeriod = undefined;
      if (period?.id) {
        endPeriodId = (Number(period.id) + el.durationperiods - 1).toString();
        endPeriod = periods.find((item) => {
          return item.id === endPeriodId;
        });
      }

      parsedLessons.push({
        id: el.id,
        subjectId: el.subjectid,
        subjectName: subjectName.short,
        teachersNames,
        classIds: el.classids,
        classIdsNames: classesData,
        dayNum: getDayNumber(card.days),
        startTime: period?.starttime || "??:??",
        endTime: endPeriod?.endtime || "??:??",
        groupNames: el.groupnames.filter((el) => el !== ""),
        rooms,
        teacherColors,
      });

      // Shift the "startPeriodId" to point to the following time slot
      startPeriodId = (Number(endPeriodId) + 1).toString();
    }
  });

  return parsedLessons;
}

function getDayNumber(value) {
  switch (value) {
    case "10000":
      return "0";
    case "01000":
      return "1";
    case "00100":
      return "2";
    case "00010":
      return "3";
    case "00001":
      return "4";
    default:
      return "-1";
  }
}
