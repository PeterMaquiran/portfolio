"use client";
import { getDictionaryByBrowser } from "@/lib/getDictionary";

const navBar = getDictionaryByBrowser().navBar;

export default function Header() {

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur  border-b"
        style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #1c2235ff 100%)',
        borderBottom: '1px solid lab(83 -18.93 -28.32 / 0.3)'
        }}
    >
			<div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
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
						<div className="font-semibold text-neutral-900 dark:text-neutral-100">
								Peter Maquiran
						</div>
						<div className="text-xs" style={{ color:"lab(83 -18.93 -28.32 / 0.7)"}}>Software Developer</div>
					</div>
				</div>
				<nav className="hidden md:flex gap-5 text-sm text-neutral-700 dark:text-neutral-300">
					{["Skills", "Projects", "Experience", "Testimonials"].map(
						(item) => (
								<a key={item} href={`#${item.toLowerCase()}`} className="hover:text-indigo-500">
								{item}
								</a>
						)
					)}
				</nav>
			</div>
    </header>
  );
}
