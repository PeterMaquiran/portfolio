"use client";
import { getDictionaryByBrowser } from "@/lib/getDictionary";

const navBar = getDictionaryByBrowser().navBar;

export default function Header() {

  return (
	<header
		className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-transparent backdrop-blur-xl"
		style={{
			background:
			"linear-gradient(120deg, rgba(15,23,42,0.9), rgba(15,23,42,0.78))",
		}}
	>
		<div className="relative max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
			{/* thin glow line at bottom */}
			<div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

			<div className="flex items-center gap-3">
				{/* <motion.div
				initial={{ scale: 0.8, rotate: -10 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", stiffness: 200 }}
				className="h-9 w-9 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow"
				>
				<Rocket className="h-5 w-5" />
				</motion.div> */}
				<div>
					<div className="font-semibold text-neutral-100">
							Peter Maquiran
					</div>
					<div className="text-xs" style={{ color:"lab(83 -18.93 -28.32 / 0.7)"}}>Software Developer</div>
				</div>
			</div>
			<nav className="hidden md:flex gap-5 text-sm text-neutral-300">
				{Object.values(navBar).map(
					(item, index) => (
						<a 
							key={item} 
							href={`#${Object.keys(navBar)[index].toLowerCase()}`} 
							className="transition-colors duration-200 hover:text-[lab(83_-18.93_-28.32_/_0.9)]"
						>
							{item}
						</a>
					)
				)}
			</nav>
		</div>
    </header>
  );
}
