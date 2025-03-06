/** @typedef {import("../types/types.mjs").TimetableNums} TimetableNums */
/** @typedef {import("../types/types.mjs").PreviousTimetables} PreviousTimetables */

/**
 * Fetch timetable numbers and names
 * @returns {Promise<TimetableNums>}
 */
export default async function fetchTimetableIds() {
  const date = new Date();

  // From what I noticed it sends the year based on the semester range, I might be wrong
  const year = date.getMonth() < 9 ? date.getFullYear() - 1 : date.getFullYear();

  return fetch("https://finki.edupage.org/timetable/server/ttviewer.js?__func=getTTViewerData", {
    method: "POST",
    body: JSON.stringify({
      __args: [null, year],
      __gsh: "00000000",
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      const regular = res.r.regular;
      const timetables = regular.timetables
        .map((item) => {
          /** @type {PreviousTimetables} */
          const table = {
            tt_num: item.tt_num,
            text: item.text,
          };
          return table;
        })
        .sort((a, b) => Number(a.tt_num) - Number(b.tt_num));

      return {
        current: regular.default_num,
        other: timetables,
      };
    });
}
