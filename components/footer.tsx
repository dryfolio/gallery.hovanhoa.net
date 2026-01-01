import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../constants'
import { ArrowUpIcon } from '@heroicons/react/24/outline'

export function Footer() {
    const [showScroll, setShowScroll] = useState(false)

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScroll && window.scrollY > 400) {
                setShowScroll(true)
            } else if (showScroll && window.scrollY <= 400) {
                setShowScroll(false)
            }
        }

        window.addEventListener('scroll', checkScrollTop)
        return () => window.removeEventListener('scroll', checkScrollTop)
    }, [showScroll])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <footer>
            <nav className="relative mx-auto max-w-xl mt-40">
                <ul className="flex items-center space-x-6 text-slate-900">
                    <p className="hover:text-slate-900 transition duration-300 ease-in-out">
                        © 2026{' '}
                        <Link
                            href={BASE_URL}
                            target="_self"
                            className="text-sky-600"
                        >
                            hovanhoa.net
                        </Link>{' '}
                        | Software Engineer
                    </p>
                </ul>
            </nav>
            
            {showScroll && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-8 p-3 bg-white text-slate-900 rounded-full shadow-lg hover:bg-slate-100 transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="w-6 h-6"
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
