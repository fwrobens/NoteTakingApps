"use client"

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoonIcon, SunIcon } from 'lucide-react';
import NoteList from '@/components/note-list';
import NoteEditor from '@/components/note-editor';
import { Note } from '@/types/note';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'notes'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notesData: Note[] = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ id: doc.id, ...doc.data() } as Note);
        });
        setNotes(notesData);
      });
      return () => unsubscribe();
    }
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error logging out",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/4 p-4 border-r border-border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Modern Note App</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[calc(100vh-200px)]">
          <NoteList
            notes={filteredNotes}
            onSelectNote={setSelectedNote}
            selectedNote={selectedNote}
          />
        </ScrollArea>
        <Button onClick={handleLogout} className="mt-4 w-full">
          Logout
        </Button>
      </div>
      <div className="flex-1 p-4">
        <Card>
          <CardContent>
            <NoteEditor
              note={selectedNote}
              onSave={() => setSelectedNote(null)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}