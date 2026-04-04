import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-indigo-900 text-white py-12 mt-16">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-semibold mb-3">GiftStudio</h3>
                    <p className="max-w-xs">
                        Your one-stop shop for unique, personalized gifts that make every occasion special.
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold">Quick Links</h4>
                    <ul>
                        <li><Link to="/" className="hover:underline">Home</Link></li>
                        <li><Link to="/gifts" className="hover:underline">Gifts</Link></li>
                        <li><Link to="/about" className="hover:underline">About</Link></li>
                        <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold">Contact</h4>
                    <p>Email: support@giftstudio.com</p>
                    <p>Phone: +91 98765 43210</p>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" aria-label="Facebook" className="hover:text-indigo-400">
                            <svg
                                className="w-6 h-6 fill-current"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54v-2.204c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.465h-1.26c-1.242 0-1.63.771-1.63 1.562v1.872h2.773l-.443 2.89h-2.33v6.987C18.344 21.128 22 16.991 22 12z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Twitter" className="hover:text-indigo-400">
                            <svg
                                className="w-6 h-6 fill-current"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.97-2.48 9.06 9.06 0 01-2.88 1.1 4.52 4.52 0 00-7.69 4.13A12.84 12.84 0 013 4.67 4.52 4.52 0 005.79 10a4.48 4.48 0 01-2.04-.56v.06a4.52 4.52 0 003.63 4.43 4.52 4.52 0 01-2.03.08 4.52 4.52 0 004.21 3.15A9.06 9.06 0 013 19.54 12.74 12.74 0 008.29 21c7.54 0 11.67-6.26 11.67-11.67 0-.18 0-.36-.01-.53A8.36 8.36 0 0023 3z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-indigo-400">
                            <svg
                                className="w-6 h-6 fill-current"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8 text-sm text-indigo-300">
                &copy; {new Date().getFullYear()} GiftStudio. All rights reserved.
            </div>
        </footer>
    );
}
