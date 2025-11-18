import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import socket from "@/lib/socket";

interface Assignment {
  id: string;
  team: string;
  password: string;
  score: number;
  status: string;
}

export default function RealtimeAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    team: "",
    password: "",
    score: 0,
    status: "active"
  });

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/assignments");
        setAssignments(response.data || []);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignments();

    // Listen for real-time updates
    socket.on("assignments:updated", (data: Assignment[]) => {
      console.log("Real-time update received:", data);
      setAssignments(data || []);
    });

    return () => {
      socket.off("assignments:updated");
    };
  }, []);

  const addAssignment = async () => {
    if (!newAssignment.team || !newAssignment.password) {
      alert("Team name and password are required");
      return;
    }

    try {
      await api.post("/api/assignments", newAssignment);
      setNewAssignment({ team: "", password: "", score: 0, status: "active" });
    } catch (error) {
      console.error("Failed to add assignment:", error);
      alert("Failed to add assignment");
    }
  };

  const updateAssignment = async (assignment: Assignment) => {
    try {
      await api.post("/api/assignments", assignment);
    } catch (error) {
      console.error("Failed to update assignment:", error);
      alert("Failed to update assignment");
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await api.delete(`/api/assignments/${id}`);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
      alert("Failed to delete assignment");
    }
  };

  const toggleStatus = (assignment: Assignment) => {
    const updated = {
      ...assignment,
      status: assignment.status === "active" ? "inactive" : "active"
    };
    updateAssignment(updated);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Real-time Team Assignments
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Live Sync
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="Team Name"
              value={newAssignment.team}
              onChange={(e) => setNewAssignment({ ...newAssignment, team: e.target.value })}
            />
            <Input
              placeholder="Password"
              value={newAssignment.password}
              onChange={(e) => setNewAssignment({ ...newAssignment, password: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Score"
              value={newAssignment.score}
              onChange={(e) => setNewAssignment({ ...newAssignment, score: parseInt(e.target.value) || 0 })}
            />
            <Button onClick={addAssignment} className="w-full">
              Add Assignment
            </Button>
          </div>

          {/* Assignments List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Current Assignments ({assignments.length})</h3>
            {isLoading ? (
              <div className="text-center py-4">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No assignments yet. Add one above to get started!
              </div>
            ) : (
              <div className="grid gap-2">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">{assignment.team}</div>
                        <div className="text-sm text-gray-500">Password: {assignment.password}</div>
                      </div>
                      <Badge variant={assignment.status === "active" ? "default" : "secondary"}>
                        {assignment.status}
                      </Badge>
                      <div className="text-lg font-bold text-blue-600">
                        {assignment.score} pts
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(assignment)}
                      >
                        {assignment.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteAssignment(assignment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="text-sm text-gray-600 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${socket.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {socket.connected ? 'Connected to server' : 'Disconnected from server'}
            </div>
            <div>Changes will sync instantly across all devices</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




