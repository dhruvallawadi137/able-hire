import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import A11yControls from "@/components/accessibility/A11yControls";

export default function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur",
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {}
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="PWD Jobs Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            PW
          </div>
          <div>
            <div className="font-extrabold">PWD Jobs</div>
            <div className="text-xs text-muted-foreground">
              Inclusive hiring made easy
            </div>
          </div>
        </Link>

        {}
        <nav
          id="nav"
          className="hidden md:flex items-center gap-6 text-sm"
          aria-label="Primary navigation"
        >
          <Link to="/jobs">Jobs</Link>
          <Link to="/saved">Saved</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/employee">Job seekers</Link>
          <Link to="/employer">Employers</Link>
        </nav>

       
        <div className="flex items-center gap-2">
          <A11yControls />
          <Link to="/jobs">
            <Button variant="secondary">Browse jobs</Button>
          </Link>
          <Link to="/employer">
            <Button>Post a job</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
