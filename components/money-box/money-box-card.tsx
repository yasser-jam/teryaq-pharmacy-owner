import { MoneyBox } from "@/types";
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Balance</CardTitle>
            <CardDescription>Money box balance right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${box?.currentBalance || 0} - {box?.currency}</div>
            <p className="text-muted-foreground text-sm mt-1">
              {/* Updated a few seconds ago */}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
