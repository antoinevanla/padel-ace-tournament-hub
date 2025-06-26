
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface BulkSchedulingToolProps {
  onBulkSchedule: (params: {
    roundName: string;
    courts: number;
    matchDuration: number;
    startTime: string;
    startDate: string;
  }) => void;
  rounds: string[];
}

const BulkSchedulingTool = ({ onBulkSchedule, rounds }: BulkSchedulingToolProps) => {
  const [bulkForm, setBulkForm] = useState({
    roundName: "",
    courts: 4,
    matchDuration: 90,
    startTime: "09:00",
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleBulkSchedule = () => {
    onBulkSchedule(bulkForm);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Bulk Scheduling Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Round</Label>
            <Select value={bulkForm.roundName} onValueChange={(value) => setBulkForm({...bulkForm, roundName: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select round" />
              </SelectTrigger>
              <SelectContent>
                {rounds.map(round => (
                  <SelectItem key={round} value={round}>{round}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Number of Courts</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={bulkForm.courts}
              onChange={(e) => setBulkForm({...bulkForm, courts: parseInt(e.target.value) || 1})}
            />
          </div>
          
          <div>
            <Label>Match Duration (minutes)</Label>
            <Input
              type="number"
              min="30"
              max="180"
              value={bulkForm.matchDuration}
              onChange={(e) => setBulkForm({...bulkForm, matchDuration: parseInt(e.target.value) || 90})}
            />
          </div>
          
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={bulkForm.startDate}
              onChange={(e) => setBulkForm({...bulkForm, startDate: e.target.value})}
            />
          </div>
          
          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              value={bulkForm.startTime}
              onChange={(e) => setBulkForm({...bulkForm, startTime: e.target.value})}
            />
          </div>
          
          <div className="flex items-end">
            <Button onClick={handleBulkSchedule} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Matches
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkSchedulingTool;
