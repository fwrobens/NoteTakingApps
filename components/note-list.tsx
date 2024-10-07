"use client"

import { Note } from '@/types/note';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface NoteListProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  selectedNote: Note | null;
}

export default function NoteList({ notes, onSelectNote, selectedNote }: NoteListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      {notes.map((note) => (
        <Button
          key={note.id}
          variant={selectedNote?.id === note.id ? 'secondary' : 'ghost'}
          className="w-full justify-start mb-2"
          onClick={() => onSelectNote(note)}
        >
          <div className="text-left">
            <div className="font-semibold">{note.title}</div>
            <div className="text-sm text-muted-foreground">{note.content.substring(0, 50)}...</div>
            <div className="mt-1">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="mr-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Button>
      ))}
    </ScrollArea>
  );
}