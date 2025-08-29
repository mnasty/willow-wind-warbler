"use client";

import { useEffect, useState } from 'react';
import type { Newsletter } from '@/lib/types';
import { deleteNewsletter, getNewsletterList, uploadNewsletter } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Loader2, Trash2, Upload } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { NewAdminForm } from './auth/NewAdminForm';
import { UpdatePasswordForm } from './auth/UpdatePasswordForm';

export default function AdminDashboard() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploadDate, setUploadDate] = useState<Date | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNewsletters = async () => {
    setIsLoading(true);
    const list = await getNewsletterList();
    setNewsletters(list);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'No file selected' });
      return;
    }
    if (!uploadDate) {
      toast({ variant: 'destructive', title: 'No date selected' });
      return;
    }
    setIsUploading(true);
    try {
      await uploadNewsletter(file, uploadDate);
      toast({ title: 'Upload successful', description: 'The newsletter has been added.' });
      setFile(null);
      setUploadDate(undefined);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if(fileInput) fileInput.value = '';
      await fetchNewsletters();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    setIsDeleting(fileName);
    try {
      await deleteNewsletter(fileName);
      toast({ title: 'Deletion successful', description: `${fileName} has been deleted.` });
      await fetchNewsletters();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Deletion failed', description: error.message });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-fredoka font-bold text-foreground group-hover:text-primary self-end pb-1">Administration</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage newsletter editions and administrators.
        </p>
      </header>

      <div className="space-y-8">
        <Card>
            <CardHeader>
            <CardTitle>Update Password</CardTitle>
            <CardDescription>
                Update the password for your administrator account.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <UpdatePasswordForm />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>New Administrator</CardTitle>
            <CardDescription>
                Create a new administrator account. A secure password will be generated and emailed to the user.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <NewAdminForm />
            </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Upload New Newsletter</CardTitle>
          <CardDescription>
            Select a PDF file and a date for the newsletter. The file will be named based on the selected date (MM-DD-YYYY.pdf).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !uploadDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {uploadDate ? format(uploadDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={uploadDate}
                onSelect={setUploadDate}
                captionLayout="dropdown-buttons"
                fromYear={1970}
                toYear={new Date().getFullYear()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} className="max-w-xs" />
          <Button onClick={handleUpload} disabled={isUploading || !file || !uploadDate}>
            {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
            Upload
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Editions</CardTitle>
          <CardDescription>
            View and delete existing newsletter editions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <ul className="space-y-2">
              {newsletters.map(nl => (
                <li key={nl.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50">
                  <div>
                    <p className="font-semibold">{nl.name}</p>
                    <p className="text-sm text-muted-foreground">{nl.date.toLocaleDateString()}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" disabled={isDeleting === nl.name}>
                        {isDeleting === nl.name ? <Loader2 className="animate-spin" /> : <Trash2 />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the newsletter file <span className="font-bold">{nl.name}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(nl.name)} className="bg-destructive hover:bg-destructive/90">
                          Yes, delete it
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
