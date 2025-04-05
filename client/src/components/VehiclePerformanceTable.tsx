import { Vehicle } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

interface VehiclePerformanceTableProps {
  vehicles: Vehicle[];
  columnEmphasis: string;
}

const VehiclePerformanceTable = ({ vehicles, columnEmphasis }: VehiclePerformanceTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">Good</span>;
      case 'Needs Review':
        return <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-600">Needs Review</span>;
      case 'Action Required':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">Action Required</span>;
      default:
        return null;
    }
  };

  const getColumnClassName = (colId: string) => {
    return colId === columnEmphasis ? 'text-blue-600 font-semibold' : '';
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Vehicle Performance Ranking</h2>
          <div className="text-sm text-gray-500">
            <span>{vehicles.length} Total Vehicles</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VIN</TableHead>
                <TableHead className={getColumnClassName('driver-score-col')} id="driver-score-col">Driver Score</TableHead>
                <TableHead className={getColumnClassName('maintenance-score-col')} id="maintenance-score-col">Maintenance Score</TableHead>
                <TableHead className={getColumnClassName('overall-score-col')} id="overall-score-col">
                  Overall Score <ChevronDown className="w-4 h-4 inline text-gray-400" />
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="font-medium">{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.driverScore}</TableCell>
                  <TableCell>{vehicle.maintenanceScore}</TableCell>
                  <TableCell className="font-medium">{vehicle.overallScore}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehiclePerformanceTable;
