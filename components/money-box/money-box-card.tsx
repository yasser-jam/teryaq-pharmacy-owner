import { MoneyBox } from "@/types";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface MoneyBoxProps {
  loading?: boolean
  box?: MoneyBox
}

export default function MoneyBoxCard({ loading, box } : MoneyBoxProps) {
  return (
    <>
      {loading ? (
        "loading.."
      ) : (
        <Card className="col-span-6 text-white bg-gradient-to-tr from-primary to-blue-500  h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Current Balance</CardTitle>
            <DollarSign className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-white text-opacity-80">Money box balance right now</CardDescription>
            <div className="text-4xl font-extrabold mt-4">${box?.currentBalance || 0} - {box?.currency}</div>
            <p className="text-muted-foreground text-sm mt-1">

            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
