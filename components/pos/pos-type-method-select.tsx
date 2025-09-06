import { Banknote, Landmark } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";

interface POSTypeMethodSelectProps {
  typeMethod: 'CASH' | 'BANK_ACCOUNT';
  setTypeMethod: (typeMethod: 'CASH' | 'BANK_ACCOUNT') => void;
}

export default function POSTypeMethodSelect({ typeMethod, setTypeMethod }: POSTypeMethodSelectProps) {
  return (
    <div>
      <Label className="mb-3 block">Type Method</Label>
      <div className="grid grid-cols-2 gap-3">
        <Card
          className={`cursor-pointer transition-all hover:shadow-sm ${
            typeMethod === "CASH"
              ? "ring-2 ring-green-500 bg-green-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => setTypeMethod("CASH")}
        >
          <CardContent className="flex items-center justify-center p-4">
            <div className="text-center">
              <Banknote className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <span className="text-sm font-medium">Cash</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-sm ${
            typeMethod === "BANK_ACCOUNT"
              ? "ring-2 ring-blue-500 bg-blue-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => setTypeMethod("BANK_ACCOUNT")}
        >
          <CardContent className="flex items-center justify-center p-4">
            <div className="text-center">
              <Landmark className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <span className="text-sm font-medium">Bank Account</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
