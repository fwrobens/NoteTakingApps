"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/types/note';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.string(),
});

interface NoteEditorProps {
  note: Note | null;
  onSave: () => void;
}

export default function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
        tags: note.tags.join(', '),
      });
      setIsEditing(true);
    } else {
      form.reset({
        title: '',
        content: '',
        tags: '',
      });
      setIsEditing(false);
    }
  }, [note, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = auth.currentUser;
    if (!user) return;

    const noteData = {
      title: values.title,
      content: values.content,
      tags: values.tags.split(',').map((tag) => tag.trim()),
      userId: user.uid,
      updatedAt: new Date(),
    };

    try {
      if (isEditing && note) {
        await updateDoc(doc(db, 'notes', note.id), noteData);
        toast({
          title: 'Note updated',
          description: 'Your note has been successfully updated.',
        });
      } else {
        await addDoc(collection(db, 'notes'), {
          ...noteData,
          createdAt: new Date(),
        });
        toast({
          title: 'Note created',
          description: 'Your new note has been successfully created.',
        });
      }
      onSave();
      form.reset();
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error saving your note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!note) return;

    try {
      await deleteDoc(doc(db, 'notes', note.id));
      toast({
        title: 'Note deleted',
        description: 'Your note has been successfully deleted.',
      });
      onSave();
      form.reset();
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error deleting your note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your note here..." {...field} className="h-40" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="work, personal, ideas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit">{isEditing ? 'Update Note' : 'Create Note'}</Button>
          {isEditing && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Note
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}