"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Clock, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import SysInfo from "../sys/sys-info";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Employee } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { successToast } from "@/lib/toast";
import { validateTimeOverlaps } from "@/lib/working-hours-utils";

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
  description?: string;
}

interface WorkingHoursRequest {
  daysOfWeek: DayOfWeek[];
  shifts: Shift[];
}

interface WorkingHoursPayload {
  workingHoursRequests: WorkingHoursRequest[];
}

interface ValidationError {
  requestIndex: number;
  shiftIndex: number;
  message: string;
}

const DAYS_OF_WEEK: DayOfWeek[] = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

interface EmployeeWorkingHoursProps {
  employee: Employee;
  onClose?: () => void;
  workingHours?: WorkingHoursRequest[];
  onChange: (workingHoursRequests: WorkingHoursRequest[]) => void;
}

export default function EmployeeWorkingHours({
  employee,
  onClose,
  workingHours: externalWorkingHours = [
    {
      daysOfWeek: [],
      shifts: [
        {
          startTime: "09:00",
          endTime: "17:00",
          description: "Regular Shift",
        },
      ],
    },
  ],
  onChange,
}: EmployeeWorkingHoursProps) {
  const [workingHoursRequests, setWorkingHoursRequests] = useState<WorkingHoursRequest[]>(
    externalWorkingHours
  );
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Sync with external workingHours prop
  // useEffect(() => {
  //   if (externalWorkingHours) {
  //     setWorkingHoursRequests(externalWorkingHours);
  //   }
  // }, [externalWorkingHours]);

  // Update parent when workingHoursRequests changes
  const updateWorkingHoursRequests = (newRequests: WorkingHoursRequest[]) => {
    setWorkingHoursRequests(newRequests);

    const hasEmptyDays = newRequests.some(
      (request) => request.daysOfWeek.length === 0
    );

    if (hasEmptyDays) {
      setValidationErrors([
        {
          requestIndex: -1,
          shiftIndex: -1,
          message: "Please select at least one day for each schedule type",
        },
      ]);
      return;
    }

    const errors = validateTimeOverlaps(newRequests);
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }
    onChange(newRequests);
  };

  useEffect(() => {
    // Initial validation when component mounts or externalWorkingHours changes
    if (externalWorkingHours) {
      const errors = validateTimeOverlaps(workingHoursRequests);
      setValidationErrors(errors);
    }
  }, [externalWorkingHours]);

  // Update parent when workingHoursRequests changes - this useEffect will now trigger after setWorkingHoursRequests in updateWorkingHoursRequests
  // and also on initial load if externalWorkingHours is present
  useEffect(() => {
    // No need to call updateWorkingHoursRequests here directly, it's handled internally now.
    // The validation and onChange call are now part of updateWorkingHoursRequests.
    // This useEffect is mainly for initial setup or external changes if needed, but not for internal updates.
  }, [workingHoursRequests]); // Keep this to re-run effects if the actual state changes

  const getShiftErrors = (
    requestIndex: number,
    shiftIndex: number
  ): string[] => {
    if (!hasSubmitted) return [];

    const globalErrors = validationErrors.filter(error => error.requestIndex === -1);
    if (globalErrors.length > 0) return globalErrors.map(error => error.message);

    return validationErrors
      .filter(
        (error) =>
          error.requestIndex === requestIndex && error.shiftIndex === shiftIndex
      )
      .map((error) => error.message);
  };

  const addWorkingHoursRequest = () => {
    const newRequests = [
      ...workingHoursRequests,
      {
        daysOfWeek: [],
        shifts: [{ startTime: "09:00", endTime: "17:00", description: "" }],
      },
    ];
    updateWorkingHoursRequests(newRequests);
  };

  const removeWorkingHoursRequest = (index: number) => {
    const newRequests = workingHoursRequests.filter((_, i) => i !== index);
    updateWorkingHoursRequests(newRequests);
  };

  const isDayUsedInOtherSchedules = (requestIndex: number, day: DayOfWeek) => {
    return workingHoursRequests.some(
      (req, idx) => idx !== requestIndex && req.daysOfWeek.includes(day)
    );
  };

  const updateDaysOfWeek = (requestIndex: number, day: DayOfWeek) => {
    const isDaySelected =
      workingHoursRequests[requestIndex].daysOfWeek.includes(day);

    if (isDayUsedInOtherSchedules(requestIndex, day)) {
      // Optionally, you could show a message here or prevent the action.
      return;
    }

    const newRequests = workingHoursRequests.map(
      (req: WorkingHoursRequest, idx: number) =>
        idx === requestIndex
          ? {
              ...req,
              daysOfWeek: isDaySelected
                ? req.daysOfWeek.filter((d: DayOfWeek) => d !== day)
                : [...req.daysOfWeek, day],
            }
          : req
    );
    updateWorkingHoursRequests(newRequests);
  };

  const addShift = (requestIndex: number) => {
    const updatedRequests = [...workingHoursRequests];
    updatedRequests[requestIndex].shifts.push({
      startTime: "09:00",
      endTime: "17:00",
      description: "",
    });
    updateWorkingHoursRequests(updatedRequests);
  };

  const removeShift = (requestIndex: number, shiftIndex: number) => {
    const updatedRequests = [...workingHoursRequests];
    updatedRequests[requestIndex].shifts = updatedRequests[
      requestIndex
    ].shifts.filter((_, i) => i !== shiftIndex);
    updateWorkingHoursRequests(updatedRequests);
  };

  const updateShift = (
    requestIndex: number,
    shiftIndex: number,
    field: keyof Shift,
    value: string
  ) => {
    const updatedRequests = [...workingHoursRequests];
    const shift = { ...updatedRequests[requestIndex].shifts[shiftIndex] };

    // @ts-ignore - TypeScript doesn't like the dynamic field access
    shift[field] = value;

    updatedRequests[requestIndex].shifts[shiftIndex] = shift;
    updateWorkingHoursRequests(updatedRequests);
  };

  // const { mutate: updateWorkingHours, isPending } = useMutation({
  //   mutationFn: (payload: WorkingHoursPayload) =>
  //     api(`employee/${employee.id}/working-hours`, {
  //       method: "PUT",
  //       body: payload,
  //     }),
  //   onSuccess: () => {
  //     successToast("Working hours updated successfully");
  //     onClose?.();
  //   },
  // });

  const handleSubmit = () => {
    setHasSubmitted(true);
    // Trigger validation by calling updateWorkingHoursRequests with the current state
    updateWorkingHoursRequests(workingHoursRequests);
  };

  return (
    <>
      <SysInfo
        text="Set the working hours for this employee. Each day can only be assigned to one schedule type."
        color="blue"
        className="mb-4"
      />
      <div className="space-y-6">
        <div className="max-h-[400px] overflow-y-auto">
          {workingHoursRequests.map((request, requestIndex) => (
            <Card key={requestIndex} className="relative mb-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Schedule Pattern {requestIndex + 1}
                  </CardTitle>
                  {workingHoursRequests.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWorkingHoursRequest(requestIndex)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Days of Week Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isDisabled = isDayUsedInOtherSchedules(
                        requestIndex,
                        day
                      );
                      const isSelected = request.daysOfWeek.includes(day);

                      return (
                        <Badge
                          key={day}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "transition-all",
                            !isSelected &&
                              !isDisabled &&
                              "cursor-pointer hover:bg-muted",
                            isDisabled && "opacity-50 cursor-not-allowed",
                            isSelected && "bg-primary text-primary-foreground"
                          )}
                          onClick={() =>
                            !isDisabled && updateDaysOfWeek(requestIndex, day)
                          }
                        >
                          {day}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Shifts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Shifts</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addShift(requestIndex)}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Shift
                    </Button>
                  </div>

                  <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                    {request.shifts.map((shift, shiftIndex) => {
                      const shiftErrors = getShiftErrors(
                        requestIndex,
                        shiftIndex
                      );
                      const hasErrors = shiftErrors.length > 0;

                      return (
                        <Card
                          key={shiftIndex}
                          className={cn(
                            "bg-muted/30",
                            hasErrors && "border-destructive"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">
                                    Start Time
                                  </Label>
                                  <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type="time"
                                      value={shift.startTime}
                                      onChange={(e) =>
                                        updateShift(
                                          requestIndex,
                                          shiftIndex,
                                          "startTime",
                                          String(e)
                                        )
                                      }
                                      className={cn(
                                        "pl-10",
                                        hasErrors && "border-destructive"
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">
                                    End Time
                                  </Label>
                                  <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type="time"
                                      value={shift.endTime}
                                      onChange={(e) =>
                                        updateShift(
                                          requestIndex,
                                          shiftIndex,
                                          "endTime",
                                          String(e)
                                        )
                                      }
                                      className={cn(
                                        "pl-10",
                                        hasErrors && "border-destructive"
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">
                                    Description
                                  </Label>
                                  <Input
                                    placeholder="e.g., Morning Shift"
                                    value={shift.description}
                                    onChange={(e) =>
                                      updateShift(
                                        requestIndex,
                                        shiftIndex,
                                        "description",
                                        String(e)
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {request.shifts.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeShift(requestIndex, shiftIndex)
                                  }
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {hasErrors && (
                              <div className="mt-3 flex items-start gap-2 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                  {shiftErrors.map((error, errorIndex) => (
                                    <p
                                      key={errorIndex}
                                      className="text-sm text-destructive"
                                    >
                                      {error}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={addWorkingHoursRequest}
            className=""
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Schedule Type
          </Button>

          {/* <Button
                onClick={handleSubmit}
                className={cn(
                  "flex-1 sm:flex-none bg-primary hover:bg-primary/90",
                  validationErrors.length > 0 && "opacity-50 cursor-not-allowed"
                )}
                disabled={validationErrors.length > 0}
                loading={isPending}
              >
                Save Working Hours
              </Button> */}
        </div>
      </div>
    </>
  );
}
