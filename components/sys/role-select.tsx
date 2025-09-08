import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BaseSelect } from "../base/select";

interface RoleSelectProps {
  value: any;
  onChange: (val: any) => void;
  className?: string;
}

export default function SysRoleSelect({
  onChange,
  className,
  ...props
}: RoleSelectProps) {
  //   const { data: items } = useQuery({
  //     queryKey: ['roles-list'],
  //     queryFn: () => api('/roles')
  //   })

  const items = [
    { id: 3, name: "Pharmacy Employee" },
    { id: 4, name: "Pharmacy Trainee" },
  ];

  return (
    <BaseSelect
      items={items}
      label="Role"
      itemText="name"
      itemValue="id"
      onChange={onChange}
      fullWidth
      className={className}
      value={props.value || ""}
      placeholder="Select Role"
    />
  );
}
