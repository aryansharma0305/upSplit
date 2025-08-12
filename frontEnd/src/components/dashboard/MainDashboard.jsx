




import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PlusCircle, Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { AddContactDialog } from "./AddContanctDialog";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { useNavigate } from "react-router-dom";

// --- Small helper components inside the file ---
const KPI = ({ title, value, prefix = "", color = "text-emerald-600" }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <Card className="h-full shadow-sm">
      <CardContent className="p-4">
        <CardDescription className="text-sm font-semibold text-slate-500">{title}</CardDescription>
        <CardTitle className={cn("text-2xl font-bold tabular-nums", color)}>
          <CountUp end={value || 0} duration={1} prefix={prefix} separator="," />
        </CardTitle>
      </CardContent>
    </Card>
  </motion.div>
);

const TransactionsGlance = ({ transactions = [] }) => {

  const Navigate= useNavigate();
  const navigateToAllTransactions = () => {
    Navigate('/dashboard/transaction-history')
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between">
          <CardDescription className="font-bold">All Transactions</CardDescription>
          <Button variant="ghost" size="sm" onClick={navigateToAllTransactions}>View all</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid By</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-sm text-slate-500">No transactions</TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted">
                  <TableCell className="whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{t.description}</TableCell>
                  <TableCell className="whitespace-nowrap">{t.amount}</TableCell>
                  <TableCell className="whitespace-nowrap">{t.paidBy}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{t.settled ? (<span className="text-emerald-600">Settled</span>) : (<span className="text-amber-600">Pending</span>)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const SectorPie = ({ data = [] }) => {
  const COLORS = ["#10b981", "#06b6d4", "#f97316", "#ef4444", "#7c3aed"];
  return (
    <Card className="h-full">
      <CardHeader className="px-4 py-3">
        <CardDescription className="font-bold">Sectoral Analysis</CardDescription>
      </CardHeader>
      <CardContent className="h-64 md:h-72 p-2">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">No sector data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} innerRadius={30} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="p-3">
        <div className="flex gap-3 flex-wrap">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-3 h-3 rounded" style={{ background: COLORS[i % COLORS.length] }} />
              <span>{d.name} — {d.value}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

// --- Main Dashboard ---
export default function MainDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ toReceive: 0, toPay: 0, net: 0 });
  const [transactions, setTransactions] = useState([]);
  const [sectorData, setSectorData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch('/api/transactions/getDashBoard');
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        if (!mounted) return;

        setKpis({
          toReceive: json.toReceive || 0,
          toPay: json.toPay || 0,
          net: json.net || 0,
        });
        setTransactions(json.transactions?.slice(0, 6) || []);
        setSectorData(json.sector || []);
      } catch (e) {
        console.error('Dashboard fetch error', e);
        if (!mounted) return;
        setKpis({ toReceive: 1250, toPay: 250, net: 1000 });
        setTransactions([
          { id: '1', date: Date.now(), description: 'Dinner', amount: '120.00', paidBy: 'Tanu', settled: false },
          { id: '2', date: Date.now()-86400000, description: 'Taxi', amount: '50.00', paidBy: 'Neha', settled: true },
        ]);
        setSectorData([{ name: 'Travel', value: 300 }, { name: 'Food', value: 200 }, { name: 'Bills', value: 100 }]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <AddContactDialog />
          <CreateGroupDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <KPI title={`To Receive`} value={kpis.toReceive} prefix={"₹"} color="text-emerald-600" />
        <KPI title={`To Pay`} value={kpis.toPay} prefix={"₹"} color="text-red-600" />
        <KPI title={`Net`} value={kpis.net} prefix={kpis.net >= 0 ? "+₹" : "-₹"} color={kpis.net >= 0 ? "text-emerald-600" : "text-red-600"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TransactionsGlance transactions={transactions} />
        </div>

        <div className="lg:col-span-1">
          <SectorPie data={sectorData} />
        </div>
      </div>

    </div>
  );
}
