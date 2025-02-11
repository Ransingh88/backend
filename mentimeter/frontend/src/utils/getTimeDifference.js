import { differenceInMilliseconds } from "date-fns";

function getTimeDifference(startDate, endDate) {
  const start = startDate;
  const end = endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("invalid date provided");
  }

  const diffInMs = Math.abs(differenceInMilliseconds(end, start));

  const diffInSec = diffInMs / 1000;

  if (diffInSec < 60) {
    return `${diffInSec.toFixed(2)} sec`;
  } else {
    const diffInMin = diffInSec / 60;
    return `${diffInMin.toFixed(2)} min`;
  }
}

export default getTimeDifference;
