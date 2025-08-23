import { timeToMinutes } from "./utils";

interface ValidationError {
  requestIndex: number;
  shiftIndex: number;
  message: string;
}
type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

interface Shift {
  startTime: string;
  endTime: string;
  description: string;
}

interface WorkingHoursRequest {
  daysOfWeek: DayOfWeek[];
  shifts: Shift[];
}

export const validateTimeOverlaps = (
  requests: WorkingHoursRequest[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  requests.forEach((request, requestIndex) => {
    // Check for overlaps within each day
    request.daysOfWeek.forEach((day) => {
      const dayShifts = request.shifts.map((shift, shiftIndex) => ({
        ...shift,
        shiftIndex,
      }));

      // Sort shifts by start time for easier comparison
      dayShifts.sort((a, b) => a.startTime.localeCompare(b.startTime));

      for (let i = 0; i < dayShifts.length - 1; i++) {
        const currentShift = dayShifts[i];
        const nextShift = dayShifts[i + 1];

        // Convert times to minutes for easier comparison
        const currentEnd = timeToMinutes(currentShift.endTime);
        const nextStart = timeToMinutes(nextShift.startTime);

        if (currentEnd > nextStart) {
          errors.push({
            requestIndex,
            shiftIndex: nextShift.shiftIndex,
            message: `Overlaps with another shift on ${day}`,
          });
        }
      }
    });

    // Check for invalid time ranges (end before start)
    request.shifts.forEach((shift, shiftIndex) => {
      const startMinutes = timeToMinutes(shift.startTime);
      const endMinutes = timeToMinutes(shift.endTime);

      if (endMinutes <= startMinutes) {
        errors.push({
          requestIndex,
          shiftIndex,
          message: "End time must be after start time",
        });
      }
    });
  });

  return errors;
};
