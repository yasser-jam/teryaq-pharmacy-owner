import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { BaseSelect } from "../base/select";


interface AreaSelectProps {
    value: any
    onChange: (val: any) => void
    className?: string
}

export default function SysAreaSelect({ onChange, className, value }: AreaSelectProps) {
    const { data: items, isFetching } = useQuery({
        queryKey: ['areas-list'],
        queryFn: () => api('/areas')
    })

    return (
        <BaseSelect
            items={items}
            label='Area'
            itemText='name'
            itemValue='id'
            onChange={onChange}
            fullWidth
            className={className}
            value={value || ''}
            loading={isFetching}
            placeholder='Select Area'
        />
    )
}