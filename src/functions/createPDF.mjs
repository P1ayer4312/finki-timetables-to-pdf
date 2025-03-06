import * as fs from "node:fs";
import * as pdfMake from "pdfmake/build/pdfmake.js";
import "pdfmake/build/vfs_fonts.js";
import getSvgColorsLine from "./getSvgColorsLine.mjs";
/** @typedef {import("../types/types.mjs").StudyProgram} StudyProgram */
/** @typedef {import("../types/types.mjs").TDocumentDefinitions} TDocumentDefinitions */

/**
 * Generate PDF file
 * @param {StudyProgram[]} data
 * @param {string} fileName
 */
export default async function createPDF(data, fileName) {
  const completedData = [];

  for (let study of data) {
    const sortedWeeks = [];

    study.weekdays.forEach((weekday) => {
      const weekdayLessons = weekday.lessons;
      let dayName = weekday.dayName;
      if (weekdayLessons.length === 0) {
        dayName = [{ text: weekday.dayName + " -- " }, { text: "Празно!", style: { color: "red" } }];
      }

      const rowsHolder = [[{ text: dayName, colSpan: 4, style: "weekdayHeader" }, {}, {}, {}]];

      weekdayLessons.forEach((lesson) => {
        let lessonRoom = lesson.rooms.join(", ");
        if (lesson.groupNames.length > 0) {
          lessonRoom += " / " + lesson.groupNames.join(", ");
        }

        rowsHolder.push([
          {
            text: lesson.subjectName,
            style: "subjectName",
            unbreakable: true,
          },
          {
            table: {
              heights: 3,
              body: [
                [
                  {
                    absolutePosition: { x: 194, y: 0 },
                    svg: getSvgColorsLine(lesson.teacherColors),
                  },
                ],
                [
                  {
                    absolutePosition: { x: 200, y: 4 },
                    text: `${lesson.startTime}-${lesson.endTime}`,
                    style: "subjectTime",
                    unbreakable: true,
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
          { text: lessonRoom || "--", style: "subjectRoom", unbreakable: true },
          { text: lesson.teachersNames.join(", ") || "--", style: "subjectTeachers", unbreakable: true },
        ]);
      });

      sortedWeeks.push(...rowsHolder);
    });

    completedData.push(
      ...[[{ text: study.studyName, style: "studyHeader", colSpan: 4 }, {}, {}, {}], ...sortedWeeks]
    );
  }

  /** @type {TDocumentDefinitions} */
  const docDefinition = {
    pageMargins: [5, 5, 5, 5],
    content: [
      {
        table: {
          widths: [185, 55, 110, 198],
          dontBreakRows: true,
          body: [
            [
              { text: "Предмет", style: "descriptionHeader" },
              { text: "Време", style: "descriptionHeader" },
              { text: "Просторија / Група", style: "descriptionHeader" },
              { text: "Професори", style: "descriptionHeader" },
            ],
            // =====
            ...completedData,
          ],
        },
      },
      {
        text: "Conversion tool link",
        style: "githubLink",
        link: "https://github.com/P1ayer4312/finki-timetables-to-pdf",
      },
    ],
    styles: {
      studyHeader: { alignment: "center", bold: true, fontSize: 13, fillColor: "gray" },
      descriptionHeader: { alignment: "center", bold: true, fontSize: 9 },
      weekdayHeader: { alignment: "center", bold: true, fontSize: 9, fillColor: "lightgray" },
      subjectName: { fontSize: 9 },
      subjectTime: { fontSize: 9 },
      subjectRoom: { fontSize: 9, alignment: "center" },
      subjectTeachers: { fontSize: 9 },
      subjectGroup: { fontSize: 9, alignment: "center" },
      githubLink: { color: "blue", bold: true, fontSize: 11, marginTop: 6 },
    },
  };

  pdfMake.createPdf(docDefinition).getBase64((result) => {
    fs.writeFileSync(`${fileName.replace(/\//gm, "_")}.pdf`, result, { encoding: "base64" });
  });
}
