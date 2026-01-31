import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getSupabase } from "@/lib/supabase";
import { isSaved, toggleSaved } from "@/lib/saved";
import { toast } from "sonner";
import PageAnnouncer from "@/components/accessibility/PageAnnouncer";

interface JobRow {
  id: string | number;
  company_name: string;
  role_title: string;
  job_description?: string;
  location?: string;
  yoe_required?: number;
  required_skills?: string[];
}

const DEMO_JOBS: JobRow[] = [
  {
    id: "1",
    company_name: "Inclusive Tech",
    role_title: "Customer Support Associate",
    job_description: "Assist users via chat and email.",
    location: "Remote",
    yoe_required: 0,
    required_skills: ["Typing", "Customer Support"],
  },
  {
    id: "2",
    company_name: "Bright Design",
    role_title: "Junior Graphic Designer",
    job_description: "Create social graphics and simple layouts.",
    location: "Delhi (Hybrid)",
    yoe_required: 1,
    required_skills: ["Graphic Design", "Designing"],
  },
];

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<JobRow | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      const sb = getSupabase();

      if (sb && id) {
        const { data } = await sb
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single();

        if (data) {
          setJob(data as JobRow);
          return;
        }
      }

      const found = DEMO_JOBS.find(
        (j) => String(j.id) === String(id)
      );

      if (found) {
        setJob(found);
      }
    };

    run();
  }, [id]);

  const apply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!job) return;

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const note = String(fd.get("note") || "").trim();

    if (!name || !email) {
      toast.error("Enter name and email");
      return;
    }

    const sb = getSupabase();
    if (sb) {
      await sb
        .from("applications")
        .insert({ job_id: job.id, name, email, note });
      toast.success("Application sent");
    } else {
      toast.success("Application recorded (demo mode)");
    }

    setOpen(false);
  };

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        Loading…
      </div>
    );
  }

  const saved = isSaved(job.id);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* 🔊 ANNOUNCE CORRECT JOB */}
      <PageAnnouncer
        title={`${job.role_title} at ${job.company_name}`}
        description={`Location ${job.location ?? "Remote"}. Experience required ${job.yoe_required ?? 0} years or more.`}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {job.role_title}
          </h1>
          <p className="text-muted-foreground">
            {job.company_name} • {job.location ?? "Remote"} • YOE {job.yoe_required ?? 0}+
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={saved ? "secondary" : "outline"}
            aria-pressed={saved}
            onClick={() => {
              const s = toggleSaved(job.id);
              toast.success(s ? "Saved job" : "Removed from saved");
            }}
          >
            {saved ? "Saved" : "Save"}
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Quick apply</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Apply to {job.role_title}
                </DialogTitle>
                <DialogDescription>
                  No sign-in required
                </DialogDescription>
              </DialogHeader>

              <form className="grid gap-3" onSubmit={apply}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="note">Cover note</Label>
                  <Textarea id="note" name="note" />
                </div>

                <Button type="submit" className="w-full">
                  Send application
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {job.job_description && (
        <p className="mt-6 max-w-2xl text-muted-foreground">
          {job.job_description}
        </p>
      )}

      {job.required_skills && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.required_skills.map((s) => (
            <span
              key={s}
              className="rounded-full border px-2 py-0.5 text-xs"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link to="/jobs" className="underline">
          ← Back to jobs
        </Link>
      </div>
    </div>
  );
}
