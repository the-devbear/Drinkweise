export interface CalculateStartTimeForConsumptionResult {
  startTime: number;
  endTime?: number;
}

export function calculateStartTimeForConsumption(
  selectedStartTimestamp: number,
  currentStartTimeStamp: number,
  currentEndTimeStamp?: number
): CalculateStartTimeForConsumptionResult {
  const selectedDate = new Date(selectedStartTimestamp);
  const currentDate = new Date(currentStartTimeStamp);
  const selectedHours = selectedDate.getHours();
  const currentHours = currentDate.getHours();

  const adjustedDate = new Date(selectedDate);

  if (selectedHours < 6 && currentHours > 18) {
    // If the selected time is in the early morning and the current time is in the late evening,
    // roll over to the next day.
    adjustedDate.setDate(adjustedDate.getDate() + 1);
  } else if (selectedHours > 18 && currentHours < 6) {
    // If the selected time is in the late evening and the current time is in the early morning,
    // roll back to the previous day.
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }

  const adjustedStartTime = adjustedDate.getTime();

  // If the adjusted start time is after the current end time,
  // add a day to the end time.
  if (currentEndTimeStamp !== undefined && adjustedStartTime > currentEndTimeStamp) {
    const currentEndDate = new Date(currentEndTimeStamp);
    currentEndDate.setDate(currentEndDate.getDate() + 1);
    const adjustedEndTime = currentEndDate.getTime();

    return {
      startTime: adjustedStartTime,
      endTime: adjustedEndTime,
    };
  }

  return {
    startTime: adjustedStartTime,
    endTime: currentEndTimeStamp,
  };
}

export function calculateEndTimeForConsumption(
  selectedEndTimestamp: number,
  currentEndTimeStamp: number,
  currentStartTimeStamp: number
): number {
  const selectedDate = new Date(selectedEndTimestamp);
  const currentDate = new Date(currentEndTimeStamp);

  if (selectedEndTimestamp < currentStartTimeStamp) {
    return selectedDate.setDate(selectedDate.getDate() + 1);
  }

  const selectedHours = selectedDate.getHours();
  const currentHours = currentDate.getHours();

  const adjustedDate = new Date(selectedDate);

  if (selectedHours < 6 && currentHours > 18) {
    // If the selected time is in the early morning and the current time is in the late evening,
    // roll over to the next day.
    adjustedDate.setDate(adjustedDate.getDate() + 1);
  } else if (selectedHours > 18 && currentHours < 6) {
    // If the selected time is in the late evening and the current time is in the early morning,
    // roll back to the previous day.
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }

  // If the adjusted end time is before the current start time,
  // add a day to the end time.
  if (adjustedDate.getTime() < currentStartTimeStamp) {
    return currentStartTimeStamp;
  }

  return adjustedDate.getTime();
}
