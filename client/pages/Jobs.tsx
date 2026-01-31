import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ALL_SKILLS } from "@/data/skills";
import { DISABILITY_TYPES } from "@/data/disabilities";
import { getSupabase } from "@/lib/supabase";
import { isSaved, toggleSaved } from "@/lib/saved";
import { Link } from "react-router-dom";
import PageAnnouncer from "@/components/accessibility/PageAnnouncer";
import { speak } from "@/lib/voice";

interface JobRow {
  id: number | string;
  company_name: string;
  role_title: string;
  job_description?: string;
  location?: string;
  yoe_required?: number;
  min_age?: number;
  max_age?: number;
  required_skills?: string[];
  disability_types?: string[];
}

export default function Jobs() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [skillFilter, setSkillFilter] = useState<Set<string>>(new Set());
  const [locationQ, setLocationQ] = useState("");
  const [yoeRange, setYoeRange] = useState<[number, number]>([0, 20]);
  const [sort, setSort] = useState<"new" | "yoe_asc" | "yoe_desc">("new");
  const [disabilityFilter, setDisabilityFilter] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [announcement, setAnnouncement] = useState("");

 
  useEffect(() => {
    const t = setTimeout(() => setDq(q), 300);
    return () => clearTimeout(t);
  }, [q]);

 
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const sb = getSupabase();
      if (sb) {
        const { data } = await sb.from("jobs").select("*");
        if (data) setJobs(data as JobRow[]);
      } else {
        setJobs([
          {
            id: "1",
            company_name: "Inclusive Tech",
            role_title: "Customer Support Associate",
            job_description: "Assist users via chat and email.",
            location: "Remote",
            yoe_required: 0,
          },
          {
            id: "2",
            company_name: "Bright Design",
            role_title: "Junior Graphic Designer",
            job_description: "Create social graphics.",
            location: "Delhi (Hybrid)",
            yoe_required: 1,
          },
        ]);
      }
      setLoading(false);
    };
    run();
  }, []);

  const list = useMemo(() => {
    const text = dq.toLowerCase();
    return jobs.filter((j) =>
      `${j.company_name} ${j.role_title}`.toLowerCase().includes(text)
    );
  }, [jobs, dq]);

  useEffect(() => {
    setAnnouncement(`${list.length} jobs match your filters`);
  }, [list.length]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <PageAnnouncer message={announcement} />

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <aside
          id="job-filters"
          tabIndex={-1}
          onFocus={() => setAnnouncement("You are now in Job Filters")}
          className="grid gap-4"
        >
          <Label htmlFor="q">Search jobs</Label>
          <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} />
        </aside>

        <section
          id="job-results"
          tabIndex={-1}
          onFocus={() => setAnnouncement("You are now in Job Results")}
          className="grid gap-4"
        >
          {!loading &&
            list.slice(0, page * pageSize).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </section>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: JobRow }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl border bg-card p-5"
      role="article"
      aria-labelledby={`job-${job.id}-title`}
    >
     
      <h4 id={`job-${job.id}-title`} className="text-lg font-semibold">
        <Link
          to={`/jobs/${job.id}`}
          onClick={() =>
            speak(`${job.role_title} at ${job.company_name}`)
          }
        >
          {job.role_title}
        </Link>
      </h4>

      <p className="text-sm text-muted-foreground">
        {job.company_name}
      </p>

     
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              speak(`Applying for ${job.role_title}`);
              setOpen(true);
            }}
          >
            Quick apply
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to {job.role_title}</DialogTitle>
            <DialogDescription>No sign-in required</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
