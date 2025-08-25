import { api } from "@/lib/api";
import { SaleInvoice, StockItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Package, Search } from "lucide-react";
import { Badge } from "../ui/badge";
import POSStockItem from "./pos-stock-item";

interface POSStockItemsProps {
    selectStockItem: (stockItem: StockItem) => void;
    invoice: SaleInvoice;
}

export default function POSStockItems({ selectStockItem, invoice }: POSStockItemsProps) {


    const { data, isFetching } = useQuery<StockItem[]>({
        queryKey: ['pos-stock-items'],
        queryFn: () => api('stock/products/Overall')
    }) 

    const [searchTerm, setSearchTerm] = useState('')
    const [filteredItems, setFilteredItems] = useState<StockItem[]>([])

    useEffect(() => {
        setFilteredItems(data?.filter((item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase())) || [])
    }, [searchTerm, data])

  return (
    <>
      <div>
        <div className="mb-4">
          <div className="relative">
            <Input
              placeholder="Search products by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(String(e))}
              prefix={<Search />}
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <POSStockItem key={item.id} item={item} selectStockItem={selectStockItem} currency={invoice.currency} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
