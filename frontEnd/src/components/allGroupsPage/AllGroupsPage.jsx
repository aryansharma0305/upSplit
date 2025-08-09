"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  CalendarDays,
  MoreVertical,
  Trash2,
  LogOut,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { GlowingEffect } from "../ui/glowing-effect";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.06,
    },
  },
};

export default function AllGroupsPage() {
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/groups/getAllGroups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched groups:", response.data);
      setGroupData(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError(err.response?.data?.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const resetFilters = () => {
    setFilterText("");
    setFilterStatus("All");
  };

  const filteredData = groupData.filter((group) => {
    const matchesText = group.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus =
      filterStatus !== "All"
        ? filterStatus === "Owner"
          ? group.isOwner
          : !group.isOwner
        : true;
    return matchesText && matchesStatus;
  });

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="w-full p-0 pt-4 sm:p-4">
      <div className="flex mb-5 flex-wrap">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          All Groups
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 pb-3 items-end">
        <div className="space-y-1 w-full text-sm">
          <Label htmlFor="search">Search by Group Name</Label>
          <Input
            id="search"
            placeholder="e.g. Trip Buddies"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-4 w-full lg:w-auto">
          <div className="space-y-1 text-sm">
            <Label htmlFor="status">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end pt-1">
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <motion.div
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredData.length ? (
            filteredData.map((group) => (
              <motion.div
                key={group.id}
                variants={cardVariants}
                className="relative rounded-lg border p-4 shadow-lg gap-3 bg-white dark:bg-gray-800 text-sm flex flex-col justify-between hover:-translate-y-1 duration-200"
              >
                <GlowingEffect
                  blur={0.5}
                  borderWidth={1.5}
                  spread={100}
                  glow={true}
                  disabled={false}
                  proximity={20}
                  inactiveZone={0}
                  className="z-0"
                />

                <div className="absolute top-3 right-4">
                  
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={group.profilePic}
                    alt={group.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  <div className="font-semibold text-base flex items-center gap-2 max-w-full pr-20 overflow-hidden">
                    <span className="truncate whitespace-nowrap overflow-hidden">{group.name}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground truncate flex items-center gap-1 cursor-default">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate">{group.members.join(", ")}</span>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    To Pay: ₹{group.owe.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    To Receive: ₹{group.toReceive.toLocaleString("en-IN")}
                  </span>
                </div>

                
                <div className="flex justify-between items-center mt-2">
                  <Button
                    size="sm"
                    className="w-fit bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:-translate-y-1 duration-100"
                    onClick={() => navigate(`/dashboard/group/${group.id}`)}
                  >
                    View Group
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground text-sm">
              No groups found.
            </div>
          )}
        </motion.div>
      </TooltipProvider>
    </div>
  );
}