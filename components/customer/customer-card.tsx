import { Customer, Debt } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import ActionMenu from '../base/action-menu'
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

interface CustomerCardProps {
  customer?: Customer;
  onEdit?: () => void;
  onDelete?: () => void;
  debts?: Debt[];
}

export default function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <>
      <Card className="rounded-sm relative bg-indigo-50 border-indigo-600 border-dashed shadow-none w-full">
        <CardContent className="!decoration-0">
          <Avatar className="bg-indigo-800 absolute -top-4 left-4 rounded-sm  flex justify-center items-center w-8 h-8">
            <AvatarFallback className="text-white">
              {customer?.name.split(" ")[0][0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-semibold text-lg">{customer?.name}</div>
          <div className="text-sm text-gray-500">{customer?.phoneNumber}</div>
          {customer?.debts && customer?.debts?.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="px-0 pt-4">Show All Debts</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-[200px] overflow-y-auto">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Debts</h4>
                    <p className="text-sm text-muted-foreground">
                      List of all outstanding debts.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {customer?.debts?.map((debt) => (
                      <div key={debt.id} className="grid grid-cols-4 items-center gap-4">
                        <div className="col-span-2">Due: {debt.dueDate}</div>
                        <div className="col-span-2 flex justify-end">
                          {debt.paidAmount} / {debt.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <div className='absolute top-4 right-4'>
            <ActionMenu editAction deleteAction onEdit={onEdit} onDelete={onDelete} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}


