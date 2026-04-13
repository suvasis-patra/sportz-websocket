import { MATCH_STATUS } from "../validations/index.js";

export const getMatchStatus = (startTime, endTime, now = new Date()) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }
  if (now >= end) {
    return MATCH_STATUS.FINISHED;
  }

  return MATCH_STATUS.LIVE;
};
export const syncMatchStatus = (matchList) => {
  return matchList.map((match) => {
    return { ...match, status: getMatchStatus(match.startTime, match.endTime) };
  });
};
