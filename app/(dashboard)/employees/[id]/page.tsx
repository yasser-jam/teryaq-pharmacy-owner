"use client";
import BasePageDialog from "@/components/base/page-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EMPLOYEE_SCHEMA } from "@/lib/schema";
import { BasePhoneInput } from "@/components/base/phone-input";
import { successToast } from "@/lib/toast";
import { BaseDatePicker } from "@/components/base/date-picker";
import { Phone, PhoneCall } from "lucide-react";
import { BaseSwitch } from "@/components/base/base-switch";
import SysRoleSelect from "@/components/sys/role-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeWorkingHours from "@/components/employee/employee-working-hours";
import BasePasswordInput from "@/components/base/base-password-input";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  type FormData = z.infer<typeof EMPLOYEE_SCHEMA>;

  const form = useForm<FormData>({
    resolver: zodResolver(EMPLOYEE_SCHEMA),
    defaultValues: {
      status: "INACTIVE",
      workingHours: [
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
    },
  });

  const { data: employee } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => api(`/employees/${id}`),
    enabled: id !== "create",
  });

  const queryClient = useQueryClient();

  const { mutate: create, isPending: createPending } = useMutation({
    mutationKey: ["employee-create"],
    mutationFn: (data: FormData) => {
      return api("/employees", {
        body: {
          ...data,
          workingHours: undefined,
          workingHoursRequests: data.workingHours,
          roleId: Number(data.roleId),
        },
        method: "POST",
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      successToast("Employee created successfully");
      goBack();
    },
  });

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationKey: ["employee-update"],
    mutationFn: (data: FormData) =>
      api(`/employees/${id}`, {
        body: {
          ...data,
          id: undefined,
          pharmacyId: undefined,
          workingHours: undefined,
          workingHoursRequests: data.workingHours,
          roleId: Number(data.roleId)
        },
        method: "PUT",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      successToast("Employee updated successfully");
      goBack();
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        ...employee,
        roleId: '3',
        workingHours: employee.workingHours && employee.workingHours.length > 0 ? employee.workingHours : [
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
      });
    }
  }, [employee, form]);

  const goBack = () => {
    router.replace("/employees");
  };

  const onSubmit = (data: FormData) => {
    id == "create" ? create(data) : update(data);
  };

  

  function GeneralTab({ form }: { form: any }) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="First Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Last Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  prefix={<Phone />}
                  placeholder="Employee Phone Number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <BasePasswordInput disabled={id != "create"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfHire"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Date of Hire</FormLabel>
              <FormControl>
                <BaseDatePicker useDefault {...field} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {
          id != 'create' && (

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <SysRoleSelect {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          )
        }

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormControl>
                <BaseSwitch
                  title="Employee Status"
                  subtitle="Employee is active (Inactive Employees can not make operations)"
                  checked={field.value === "ACTIVE"}
                  onCheckedChange={(checked) =>
                    form.setValue("status", checked ? "ACTIVE" : "INACTIVE")
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  function WorkingHoursTab() {
    const workingHours = form.watch("workingHours");
    return (
      <div className="">
        <EmployeeWorkingHours
          employee={employee}
          workingHours={workingHours}
          onChange={(data) => form.setValue("workingHours", data)}
        />
      </div>
    );
  }

  return (
    <BasePageDialog
      title="Employee Details"
      subtitle="Fill Employee Data"
      className="w-[1200px]"
      onOpenChange={goBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralTab form={form} />
            </TabsContent>

            <TabsContent value="working-hours">
              <WorkingHoursTab />
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="ghost" onClick={goBack} type="button">
              Cancel
            </Button>
            <Button loading={createPending || updatePending} type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </BasePageDialog>
  );
}
