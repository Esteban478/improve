import Link from "next/link";
import UserAccount from "./UserAccount";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          {/* Logo and brand name */}
          <Link 
            href="/" 
            className="text-3xl flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
          >
            <Image
              src="/improve.png"
              alt="Improve Logo"
              width={28}
              height={28}
              className="rounded-full" // Optional: if you want to round the logo
            />
            <span>
              Improve
            </span>
          </Link>
          
          {/* Navigation link */}
          <Link 
            href="/colors" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Colors
          </Link>
        </div>

        {/* User account section */}
        <UserAccount />
      </div>
    </nav>
  );
}