import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'

const HOME = 'https://hovanhoa.net'

type FooterLink = { label: string; href: string }

const PAGES: FooterLink[] = [
    { label: 'home', href: 'https://hovanhoa.net' },
    { label: 'insight', href: 'https://insight.hovanhoa.net' },
    { label: 'gallery', href: 'https://gallery.hovanhoa.net' },
    { label: 'music', href: 'https://music.hovanhoa.net' },
    { label: 'status', href: 'https://status.hovanhoa.net' },
]

const ELSEWHERE: FooterLink[] = [
    { label: 'github', href: 'https://github.com/hovanhoa' },
    { label: 'twitter', href: 'https://twitter.com/_hovanhoa_' },
    { label: 'linkedin', href: 'https://linkedin.com/in/hovanhoa' },
    { label: 'connect', href: 'https://info.hovanhoa.net' },
]

const linkClass =
    'font-[family-name:var(--font-mono)] text-sm text-[var(--rd-text-2)] transition-colors duration-200 hover:text-[var(--rd-accent-ink)]'

function LinkRow({ links }: { links: FooterLink[] }) {
    return (
        <div className="flex flex-wrap gap-x-7 gap-y-3">
            {links.map((l) => (
                <a key={l.label} href={l.href} className={linkClass}>
                    {l.label}
                </a>
            ))}
        </div>
    )
}

export function Footer() {
    const [showScroll, setShowScroll] = useState(false)
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const checkScrollTop = () => {
            if (window.scrollY > 400) {
                setShowScroll(true)
                if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
                hideTimeoutRef.current = setTimeout(
                    () => setShowScroll(false),
                    1000
                )
            } else {
                setShowScroll(false)
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current)
                    hideTimeoutRef.current = null
                }
            }
        }
        window.addEventListener('scroll', checkScrollTop)
        return () => {
            window.removeEventListener('scroll', checkScrollTop)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        }
    }, [])

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer
            className="mt-28 border-t border-[var(--rd-border)]"
            style={{
                background:
                    'radial-gradient(100% 140% at 0% 0%, var(--rd-accent-bg), transparent 55%), var(--rd-surface-2)',
            }}
        >
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-16 sm:py-20">
                <Link
                    href={HOME}
                    className="block text-2xl font-bold tracking-tight text-[var(--rd-text)] sm:text-3xl"
                >
                    hovanhoa
                    <span className="text-[var(--rd-accent)]">.net</span>
                </Link>
                <p className="rd-lead mt-4">
                    software engineer — building, writing, and shipping. one
                    small corner of the internet, a few sites deep.
                </p>

                <div className="mt-12 space-y-4">
                    <LinkRow links={PAGES} />
                    <LinkRow links={ELSEWHERE} />
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-[var(--rd-border)] pt-6 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 hovanhoa</p>
                    <p>
                        crafted &amp; maintained by{' '}
                        <a href={HOME} className="text-[var(--rd-accent-ink)]">
                            hovanhoa
                        </a>
                    </p>
                </div>
            </div>

            {showScroll && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-8 z-50 rounded-full bg-white p-3 text-slate-900 shadow-lg transition-all duration-300 hover:bg-slate-100"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </footer>
    )
}
