import { Customer } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import ActionMenu from '../base/action-menu'
import CustomerCardDebtsDialog from "./customer-card-debts-dialog";

interface CustomerCardProps {
  customer?: Customer;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  const hasDebts = customer?.debts && customer.debts.length > 0;
  const hasOverdueDebts =
    customer?.debts?.some((debt) => {
      const remainingAmount = (debt.amount || 0) - (debt.paidAmount || 0);
      if (remainingAmount > 0 && debt.dueDate) {
        const dueDate = new Date(debt.dueDate);
        const today = new Date();
        return dueDate < today;
      }
      return false;
    }) || false;

  const cardClasses = `rounded-sm relative shadow-none w-full ${hasOverdueDebts
    ? 'bg-red-50 border-red-600 border-dashed'
    : hasDebts
      ? 'bg-yellow-50 border-yellow-600 border-dashed'
      : 'bg-indigo-50 border-indigo-600 border-dashed'
    }`;

  return (
    <>
      <Card className={cardClasses}>
        <CardContent className="!decoration-0">
          <Avatar className="bg-indigo-800 absolute -top-4 left-4 rounded-sm  flex justify-center items-center w-8 h-8">
            <AvatarFallback className="text-white">
              {customer?.name.split(" ")[0][0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-semibold text-lg">{customer?.name}</div>
          <div className="text-sm text-gray-500">{customer?.phoneNumber}</div>
          {customer?.debts && customer?.debts?.length > 0 && (
            <CustomerCardDebtsDialog customer={customer} />
          )}

          <div className='absolute top-4 right-4'>
            <ActionMenu editAction deleteAction={!!!customer?.debts?.length} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}


