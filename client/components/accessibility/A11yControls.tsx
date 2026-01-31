import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Accessibility } from "lucide-react";
import { useTheme } from "next-themes";
import { useDyslexia } from "@/lib/DyslexiaContext";
import ReadEasySettings from "./ReadEasySettings";

export default function A11yControls({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const {
    readEasyMode,
    setReadEasyMode,
    textToSpeechEnabled,
    setTextToSpeechEnabled,
    readOnHoverEnabled,
    setReadOnHoverEnabled,
    signOnHoverEnabled,
    setSignOnHoverEnabled,
  } = useDyslexia();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
          aria-label="Accessibility settings"
        >
          <Accessibility className="h-4 w-4" />
          Accessibility
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">

          
          <Row
            title="Dark mode"
            desc="Reduce glare in low light."
          >
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
            />
          </Row>

          
          <Row
            title="ReadEasy mode"
            desc="Dyslexia-friendly spacing and fonts."
          >
            <Switch
              checked={readEasyMode}
              onCheckedChange={setReadEasyMode}
            />
          </Row>

          <ReadEasySettings />

          
          <Row
            title="Text to speech"
            desc="Speak focused elements."
          >
            <Switch
              checked={textToSpeechEnabled}
              onCheckedChange={setTextToSpeechEnabled}
            />
          </Row>

         
          <Row
            title="Read on hover"
            desc="Speak text when hovering."
          >
            <Switch
              checked={readOnHoverEnabled}
              onCheckedChange={setReadOnHoverEnabled}
            />
          </Row>

        
          <Row
            title="Sign on hover"
            desc="Visual fingerspelling on hover."
          >
            <Switch
              checked={signOnHoverEnabled}
              onCheckedChange={setSignOnHoverEnabled}
            />
          </Row>

        </div>
      </PopoverContent>
    </Popover>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}
