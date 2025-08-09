
"use-client"
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

export function AddContactDialog() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [mockUsers, setMockUsers] = useState([]);
  const closeButtonRef = useRef(null);
  const navigate = useNavigate();
  const [loadingUserId, setLoadingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/getrandomusers");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setMockUsers(data);
      console.log("Fetched users:", data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      if (!query) {
        setResults(mockUsers.map(user => ({
          ...user,
          
        })));
        return;
      }

      const searchQuery = query.trim();
      fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
          const updatedResults = data.map(user => ({
            ...user,
            
          }));
          console.log("Search results:", updatedResults);
          setResults(updatedResults);
        })
        .catch(error => {
          console.error("Error searching users:", error);
          setResults([]);
        });

    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [query, mockUsers]); 


  const handleAdd = (userId,username) => {
    setLoadingUserId(userId);
    fetch("/api/users/addcontact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id:userId }),
      
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add contact");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Contact added successfully:", data);
            return new Promise((resolve) => {
                    setTimeout(() => {
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.85 },
                        colors: ["#34D399", "#10B981", "#059669"],
                      });
                      setTimeout(() => {
                        closeButtonRef.current?.click();
                        navigate(`/dashboard/contact/${username}`);
                      }, 500);
                      setLoadingUserId(null);
                      resolve();
                    }, 1000);
           });
      })
      .catch((error) => {
        console.error("Error adding contact:", error);
        setLoadingUserId(null);
        alert("Failed to add contact. Please try again.");
      });
  };
    
 

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 hover:-translate-y-0.5 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          Add Contact
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a new contact</DialogTitle>
          <DialogDescription>
            Search for users by name or email to add them to your contact list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="e.g. Aryan or aryan@upsplit.com"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="max-h-64 rounded-md border p-2">
            {results.length > 0 ? (
              results.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-muted transition"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={user.photoURL}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full border"
                    />
                    <div className="truncate">
                      <p className="font-medium truncate max-w-[200px]">
                        {user.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {
                      user.alreadyAdded ? (
                        <Button
                          variant="secondary"
                          disabled
                          className="cursor-not-allowed"
                        >
                          Already Added
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleAdd(user._id, user.username)}
                          disabled={loadingUserId === user._id}
                        >
                          {loadingUserId === user._id ? "Adding..." : "Add"}
                        </Button>
                      )
                    }
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {mockUsers.length === 0 ? "Loading users..." : "No users found."}
              </p>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeButtonRef} variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}