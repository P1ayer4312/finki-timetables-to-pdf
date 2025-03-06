/**
 * Fetch timetable data
 * @param {string} timetableNum
 * @returns {Promise<object>}
 */
export default async function fetchTimetableData(timetableNum) {
  return fetch("https://finki.edupage.org/timetable/server/regulartt.js?__func=regularttGetData", {
    body: JSON.stringify({
      __args: [null, String(timetableNum)],
      __gsh: "00000000",
    }),
    method: "POST",
  }).then((res) => res.json());
}
