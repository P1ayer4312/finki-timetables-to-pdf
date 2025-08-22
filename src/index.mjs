import fetchTimetableData from "./functions/fetchTimetableData.mjs";
import fetchTimetableIds from "./functions/fetchTimetableIds.mjs";
import parseData from "./functions/parseData.mjs";
import createPDF from "./functions/createPDF.mjs";

console.clear();
console.log("Fetching timetable ids...");
const tables = await fetchTimetableIds();

console.log("Available timetables:");
tables.other.forEach((item) => console.log(`${item.tt_num.padStart(4)}: ${item.text}`));

// Swap this value with any existing timetable num if you want to generate previous one
// Example: timetableNum = "14";
const timetableNum = tables.current || tables.other.at(-1).tt_num;

const targetTimetable = tables.other.find((item) => item.tt_num == String(timetableNum));

console.log(`\n\nFetching timetable: ${targetTimetable.text}...`);
const data = await fetchTimetableData(targetTimetable.tt_num);

console.log("Parsing data...");
const parsedData = parseData(data);

console.log("Creating PDF file...");
createPDF(parsedData, targetTimetable.text);

console.log("Done.");
