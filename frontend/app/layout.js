import "./globals.css";
import Providers from "@/providers/providers";

export const metadata = {
  title: "Saint Vital — Wear Your Legacy",
  description:
    "Modern fashion essentials crafted with intention. Premium clothing for those who value quality and timeless style.",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('sv-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
