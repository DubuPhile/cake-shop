"use client";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setIsDarkMode } from "@/redux/state/global";
import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import UserDropdown from "../DropdownUser";
import Image from "next/image";
import icon from "@/app/icon.png";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      } else if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="flex flex-col">
      <div className="flex justify-between items-center w-full mb-2">
        {/* LEFT SIDE */}
        <div className="flex justify-between items-center gap-5">
          <div className="px-2 py-1 rounded-full hover:bg-[hsl(359,100%,95%)] flex items-center gap-2 cursor-pointer">
            <Image
              src={icon}
              alt="brand"
              width={40}
              height={40}
              className=" w-10 h-10 object-cover rounded-full"
              priority
            />
            <span
              className={`hidden md:block font-lobster text-transparent bg-linear-to-r from-[#510424] dark:from-[#fcf6f8] via-[#f6339a] to-[hsl(359,100%,75%)] text-lg bg-clip-text`}
            >
              Amiel Cake Shop
            </span>
          </div>
          <div className="relative">
            <input
              type="search"
              id="searchBar"
              placeholder="Search Product..."
              className="pl-10 pr-4 py-2 w-30 sm:w-50 md:w-60 border-2 text-xs sm:text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-500 rounded-2xl focus:outline-none focus:border-[hsl(359,100%,75%)] "
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Bell className="text-gray-500 dark:text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-between items-center gap-5">
          <div className="hidden md:flex justify-between items-center gap-5">
            <div>
              <button onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <Sun className="cursor-pointer text-gray-400" size={24} />
                ) : (
                  <Moon className="cursor-pointer text-gray-500" size={24} />
                )}
              </button>
            </div>
            <div className="relative">
              <Bell
                className="cursor-pointer text-gray-500 dark:text-gray-400"
                size={24}
              />
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
                3
              </span>
            </div>
            <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-1" />
          </div>
          <div className="flex items-center cursor-pointer">
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Link
                href={"/login"}
                className="flex gap-3 hover:bg-[hsl(359,100%,95%)] dark:hover:bg-[hsl(359,100%,35%)] px-3 py-2 rounded-full"
              >
                <UserRound />
                <span className="hidden md:block">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 border-b border-pink-100 bg-[#FFF8F3]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-200 text-2xl shadow-sm">
              🍰
            </div>

            <div>
              <h1 className="text-md md:text-lg font-bold text-pink-950">
                Sweet Bites
              </h1>
              <p className="text-xs text-pink-500">Freshly baked happiness</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <Link
              href="/"
              className="font-medium text-gray-700 transition hover:text-pink-500 hover:scale-110"
            >
              Home
            </Link>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 font-medium text-gray-700 transition hover:scale-110 hover:text-pink-500"
              >
                Cakes
                <ChevronDown
                  className={`h-4 w-4 transition ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-3 w-60 rounded-3xl border border-pink-100 bg-white p-3 shadow-xl"
                  >
                    {[
                      "Birthday Cakes",
                      "Wedding Cakes",
                      "Chocolate Cakes",
                      "Cupcakes",
                      "Bento Cakes",
                    ].map((cake) => (
                      <button
                        key={cake}
                        className="w-full rounded-2xl px-4 py-3 text-left text-gray-700 transition hover:scale-110 hover:bg-pink-50 hover:text-pink-600"
                      >
                        {cake}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/custom-cake"
              className="font-medium text-gray-700 transition hover:text-pink-500 hover:scale-110"
            >
              Custom Cake
            </Link>

            <Link
              href="/gallery"
              className="font-medium text-gray-700 transition hover:text-pink-500 hover:scale-110"
            >
              Gallery
            </Link>

            <Link
              href="/about"
              className="font-medium text-gray-700 transition hover:text-pink-500 hover:scale-110"
            >
              About
            </Link>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <button className="rounded-full border border-pink-200 p-3 transition hover:scale-110 hover:bg-pink-50 cursor-pointer">
              <ShoppingBag className="h-5 w-5 text-pink-600" />
            </button>

            <button className="rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-pink-600 cursor-pointer">
              Order Now
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              ref={mobileRef}
              className="overflow-hidden border-t border-pink-100 bg-[#FFF8F3] lg:hidden"
            >
              <div className="fixed flex flex-col right-0 gap-4 p-6 z-10 border-pink-100 bg-[#FFF8F3] drop-shadow-md">
                <Link href="/" className="hover:text-pink-500">
                  Home
                </Link>
                <Link href="/cakes" className="hover:text-pink-500">
                  Cakes
                </Link>
                <Link href="/custom-cake" className="hover:text-pink-500">
                  Custom Cake
                </Link>
                <Link href="/gallery" className="hover:text-pink-500">
                  Gallery
                </Link>
                <Link href="/about" className="hover:text-pink-500">
                  About
                </Link>

                <button className="mt-2 rounded-full bg-pink-500 py-3 font-semibold text-white cursor-pointer">
                  Order Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
