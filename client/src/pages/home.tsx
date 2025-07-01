import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pizza, Camera, FileText, MapPin, Clock, Phone, Flame, ChefHat,
  Sandwich, Drumstick, EggFried, Croissant, CupSoda, Salad, Soup, IceCream, CakeSlice, Mail, Leaf, Apple, Carrot,
  LucidePizza
} from "lucide-react";


// --- Premium Scrollbar CSS (injects global style) ---
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    ::-webkit-scrollbar {
      width: 12px;
      background: linear-gradient(120deg, #2d1e13 0%, #b97a56 100%);
      border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(120deg, #ff9800 0%, #b97a56 100%);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(255,140,0,0.15);
    }
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(120deg, #ffb74d 0%, #ff9800 100%);
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
    html {
      scrollbar-width: thin;
      scrollbar-color: #ff9800 #2d1e13;
    }
  `;
  document.head.appendChild(style);
}

export function CheeseDrops() {
  const iconOptions = [
    Pizza, ChefHat, Flame, Sandwich, Drumstick, EggFried, Croissant, CupSoda, Salad, Soup, IceCream, CakeSlice, Leaf, Apple, Carrot
  ];
  const colorOptions = [
    "var(--golden-cheese)",
    "var(--warm-amber)",
    "var(--fire-orange)"
  ];
  const [drops, setDrops] = useState<Array<{
    id: number;
    x: number;
    icon: React.ElementType;
    color: string;
    createdAt: number;
    delay: number;
  }>>([]);

  // Duration of a single drop's fall (should match transition.duration)
  const DROP_DURATION = 17;

  useEffect(() => {
    let dropId = 0;
    const interval = setInterval(() => {
      setDrops((prev) => [
        ...prev,
        {
          id: dropId++,
          x: Math.random() * 100,
          icon: iconOptions[Math.floor(Math.random() * iconOptions.length)],
          color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
          createdAt: Date.now(),
          delay: 0
        }
      ]);
    }, 500); // release a new drop every 0.5s

    return () => clearInterval(interval);
  }, []);

  // Clean up drops after they finish falling
  useEffect(() => {
    if (!drops.length) return;
    const timeout = setTimeout(() => {
      const now = Date.now();
      setDrops((prev) =>
        prev.filter((drop) => now - drop.createdAt < DROP_DURATION * 1000 + 1000)
      );
    }, 2000);
    return () => clearTimeout(timeout);
  }, [drops]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {drops.map((drop) => {
        const Icon = drop.icon;
        const fallTo = typeof window !== "undefined"
          ? Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) + 40
          : 1200;
        return (
          <motion.div
            key={drop.id}
            className="absolute flex items-center justify-center"
            style={{ left: `${drop.x}%` }}
            initial={{ y: -40, rotate: 0, opacity: 0.7, scale: 1 }}
            animate={{
              y: fallTo,
              rotate: 360,
              scale: [1, 1.2, 0.8, 1],
              opacity: 0.7
            }}
            transition={{
              duration: DROP_DURATION,
              delay: drop.delay,
              ease: "linear",
            }}
          >
            <Icon
              style={{
                color: `hsl(${drop.color})`,
                filter: "drop-shadow(0 2px 8px hsl(var(--golden-cheese))/0.5)"
              }}
              className="w-10 h-10"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => setViewportHeight(window.innerHeight);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Add ref for testimonial section
  const testimonialRef = useRef<HTMLDivElement | null>(null);

  // Slideshow data for header
  interface Slide {
    id: number;
    title: string;
    subtitle: string;
    buttonText?: string;
    buttonLink?: string;
    bgImage: string;
    delay: number;
    orderButtons?: boolean; // new property for order buttons
  }

const slides: Slide[] = [
    {
      id: 1,
      title: "SuBakes – Wood Fired Pizzeria",
      subtitle: "Unforgettable moments, unforgettable flavors. Experience the magic of wood-fired Italian cuisine.",
      // Remove buttonText/buttonLink for this slide
      bgImage: "/images/Leopard Spotted Neapolitan Style Pizza 2.png",
      delay: 1.5,
      orderButtons: true, // show order buttons for this slide
    },
    {
      id: 2,
      title: "The best spot for Anything",
      subtitle: "Savor breakfast by firelight—crafted with passion, served with warmth.",
      buttonText: "View Our Gallery",
      buttonLink: "/gallery", // changed from "gallery.html" to "/gallery"
      bgImage: "/images/home 3.png",
      delay: 1.5,
    },
    {
      id: 3,
      title: "Taste the flavors of Italy in your town Pune!",
      subtitle: "Bringing the authentic taste of Italy to Pune—one slice at a time.",
      buttonText: "Browse Our Menu",
      buttonLink: "/menu", // changed from "#Order" to "/menu"
      bgImage: "/images/Leopard Spotted Neapolitan Style Pizza 4.png",
      delay: 1.5,
    },
  ];

  // Slideshow state for header
  const [headerSlide, setHeaderSlide] = useState(0);
  const [headerFade, setHeaderFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderFade(false);
      setTimeout(() => {
        setHeaderSlide((prev) => (prev + 1) % slides.length);
        setHeaderFade(true);
      }, 500); // match fade duration
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Floating Subakes menu state
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  // Refs for smooth scroll
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const contactFormRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const visitRef = useRef<HTMLDivElement | null>(null);

  // FAB image slow rotation state
  const [fabRotation, setFabRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFabRotation((prev) => prev + 1);
    }, 20); // ~18 seconds per full rotation (360deg/1deg*20ms)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--charcoal-black))] via-[hsl(var(--wood-brown))] to-[hsl(var(--rustic-red))] overflow-hidden">
      <CheeseDrops />

      {/* Hamburger Menu Drawer */}
      <AnimatePresence>
        {showHamburgerMenu && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-72 max-w-full h-full z-[100] bg-[hsl(var(--charcoal-black))] shadow-2xl flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold text-[hsl(var(--fire-orange))]">Menu</span>
              <button
                className="text-[hsl(var(--cream-white))] text-3xl focus:outline-none"
                onClick={() => setShowHamburgerMenu(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {/* Home */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                onClick={() => {
                  setShowHamburgerMenu(false);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                }}
              >
                <Pizza className="w-5 h-5" />
                Home
              </button>
              {/* About Us */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                onClick={() => {
                  setShowHamburgerMenu(false);
                  setTimeout(() => aboutRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                }}
              >
                <Flame className="w-5 h-5" />
                About Us
              </button>
              {/* Our Specialities */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                onClick={() => {
                  setShowHamburgerMenu(false);
                  setTimeout(() => featuresRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                }}
              >
                <ChefHat className="w-5 h-5" />
                Our Specialities
              </button>
              {/* Find Us */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                onClick={() => {
                  setShowHamburgerMenu(false);
                  setTimeout(() => visitRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                }}
              >
                <MapPin className="w-5 h-5" />
                Find Us
              </button>
              {/* Contact Us */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                onClick={() => {
                  setShowHamburgerMenu(false);
                  setTimeout(() => {
                    contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </button>
              {/* Read Our Reviews */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                onClick={() => {
                  setShowHamburgerMenu(false);
                  setTimeout(() => {
                    testimonialRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                <CakeSlice className="w-5 h-5" />
                Read Our Reviews
              </button>
              {/* See Our Menu */}
              <Link href="/menu">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                  onClick={() => setShowHamburgerMenu(false)}
                >
                  <FileText className="w-5 h-5" />
                  See Our Menu
                </button>
              </Link>
              {/* Explore Our Gallery */}
              <Link href="/gallery">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                  onClick={() => setShowHamburgerMenu(false)}
                >
                  <Camera className="w-5 h-5" />
                  Explore Our Gallery
                </button>
              </Link>
              {/* Call 090215 49565 */}
              <a
                href="tel:09021549565"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-white transition"
                onClick={() => setShowHamburgerMenu(false)}
              >
                <Phone className="w-5 h-5" />
                Call 090215 49565
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Overlay for hamburger menu */}
      {showHamburgerMenu && (
        <div
          className="fixed inset-0 z-[99] bg-black/40"
          onClick={() => setShowHamburgerMenu(false)}
        />
      )}

      {/* Mouse follower effect */}
      <motion.div
        className="fixed w-6 h-6 bg-[hsl(var(--fire-orange))]/30 rounded-full pointer-events-none z-20 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--charcoal-black))]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 relative">
            {/* Logo image on the left */}
            <div className="flex items-center mr-4">
              <img
                src="/other images/download.png"
                alt="SuBakes Logo"
                className="w-14 h-14 rounded-full object-cover border-4 border-[hsl(var(--fire-orange))] shadow-lg bg-white"
                style={{ background: "white" }}
                draggable={false}
              />
            </div>
            {/* Hamburger icon (now always visible) */}
            <button
              className="flex items-center px-3 py-2 rounded text-[hsl(var(--fire-orange))] hover:bg-[hsl(var(--fire-orange))]/10 focus:outline-none"
              onClick={() => setShowHamburgerMenu(true)}
              aria-label="Open menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Brand name always centered */}
            <div className="flex-1 flex justify-center items-center">
              <div className="flex items-center space-x-3">
                <Pizza className="h-8 w-8 text-[hsl(var(--fire-orange))] md:block hidden" />
                <span
                className="font-bold text-[hsl(var(--cream-white))] text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif tracking-tight transition-all brand-title"
>
                  Subakes - Wood Fired Pizzaria
                </span>
                <Flame className="h-5 w-5 text-[hsl(var(--fire-orange))] md:block hidden" />
              </div>
            </div>
            {/* Desktop/Tablet icons (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-4 absolute right-0 top-1/2 -translate-y-1/2">
              <Pizza className="h-8 w-8 text-[hsl(var(--fire-orange))]" />
              <Flame className="h-5 w-5 text-[hsl(var(--fire-orange))]" />
            </div>
          </div>
        </div>
      </nav>


{/* Header Slideshow Section */}
<section className="relative min-h-screen flex items-center justify-center pt-16">
  {/* Animate background image */}
  <AnimatePresence mode="wait">
    <motion.div
      key={headerSlide}
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${slides[headerSlide].bgImage}')`,
      }}
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 0.7, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    />
  </AnimatePresence>
  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--charcoal-black))]/80 via-[hsl(var(--rustic-red))]/60 to-[hsl(var(--fire-orange))]/40" />

  <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
    <AnimatePresence mode="wait">
      <motion.div
        key={headerSlide}
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title slides up */}
        <motion.h3
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeInOut" }}
        >
          {slides[headerSlide].title}
        </motion.h3>
        {/* Subtitle slides down */}
        <motion.h1
          className="text-2xl md:text-4xl font-light mb-8"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeInOut" }}
        >
          {slides[headerSlide].subtitle}
        </motion.h1>
        {/* Buttons fade and zoom in */}
        {slides[headerSlide].orderButtons ? (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
          >
            <a
              href="https://www.zomato.com/pune/subakes-sadashiv-peth"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#E23744] hover:bg-[#b71c1c] text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg transition"
            >
              Order from Zomato
            </a>
            <a
              href="https://www.swiggy.com/city/pune/subakes-kasba-vishrambag-swargate-rest649535"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FC8019] hover:bg-[#b75c0c] text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg transition"
            >
              Order from Swiggy
            </a>
          </motion.div>
        ) : (
          slides[headerSlide].buttonText && (
            <motion.a
              href={slides[headerSlide].buttonLink}
              className="inline-block bg-[hsl(var(--fire-orange))] hover:bg-[hsl(var(--warm-amber))] text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg transition"
              key={slides[headerSlide].buttonText}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
              onClick={e => {
                if (
                  slides[headerSlide].buttonLink === "#team" ||
                  slides[headerSlide].buttonLink === "#features"
                ) {
                  e.preventDefault();
                  featuresRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {slides[headerSlide].buttonText}
            </motion.a>
          )
        )}
        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${headerSlide === idx ? "bg-[hsl(var(--fire-orange))]" : "bg-white/30"} transition`}
              onClick={() => { setHeaderSlide(idx); setHeaderFade(true); }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</section>

      {/* About Us Section */}
      <section
        ref={aboutRef}
        className="relative z-20 py-16"
        style={{
          background: `
            linear-gradient(
              120deg,
              rgba(255,255,255,0.18) 0%,
              rgba(255, 240, 220, 0.18) 100%
            ),
            hsl(var(--cream-white), 0.18)
          `,
          borderTop: "1.5px solid hsl(var(--fire-orange), 0.10)",
          borderBottom: "1.5px solid hsl(var(--fire-orange), 0.10)",
          boxShadow: "0 8px 32px 0 rgba(255,140,0,0.07)"
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center rounded-2xl shadow-xl backdrop-blur-sm">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-[hsl(var(--cream-white))] mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            About Us
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl font-semibold mb-4"
            style={{ color: "hsl(var(--charcoal-black))" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-[hsl(var(--fire-orange))]">Crafting Italy’s finest flavors since 2020.</span>
          </motion.p>
          <motion.p
            className="text-lg text-[hsl(var(--smoke-gray))] mb-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Su-swagatam (welcome) to <span className="font-bold text-[hsl(var(--fire-orange))]">Su-Bakes</span>, your destination for delicious, high-quality, and authentically crafted wood-fired pizzas. “Su”, a Sanskrit prefix, stands for all things good, qualitative, and neat—and also honors Sukrutee, who turned her passion for cookery into a culinary journey.
          </motion.p>
          <div className="pt-8 pb-2">
            <motion.p
              className="text-sm uppercase tracking-widest text-[hsl(var(--fire-orange))] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              We have something you don't know
            </motion.p>
          </div>
          <motion.h3
            className="text-5xl md:text-6xl font-bold text-[hsl(var(--cream-white))] mb-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Wood Fired Oven
          </motion.h3>
          <motion.p
            className="text-lg text-[hsl(var(--smoke-gray))]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            At SuBakes, our passion is <span className="font-semibold text-[hsl(var(--fire-orange))]">Neapolitan-Style Pizza</span>, each one kissed by the flames of our traditional wood-fired oven. Every bite is a symphony of flavors, reminiscent of the iconic pizzas found on the streets of Naples, Italy. We use only the finest ingredients and time-honored techniques to deliver an experience that transports you straight to the heart of Italy—right here in Pune.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative z-20 py-20"
        style={{
          background: `
            linear-gradient(
              120deg,
              rgba(120, 80, 40, 0.18) 0%,
              rgba(80, 40, 20, 0.22) 100%
            ),
            hsl(var(--wood-brown), 0.22)
          `,
          borderTop: "1.5px solid rgba(255,255,255,0.10)",
          borderBottom: "1.5px solid rgba(255,255,255,0.10)",
          boxShadow: "0 8px 32px 0 rgba(120,80,40,0.10)"
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-[hsl(var(--cream-white))] mb-6">
              Why SuBakes Stands Out?
            </h2>
            <p className="text-xl text-[hsl(var(--smoke-gray))] max-w-3xl mx-auto">
              Discover the difference: authentic Italian tradition, premium ingredients, and a passion for perfection in every bite.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: LucidePizza,
                title: "Freshly Made Cheese",
                description: "Indulge in our creamy, homemade cheese—crafted daily for a melt-in-your-mouth experience on every pizza.",
                color: "golden-cheese"
              },
              {
                icon: Flame,
                title: "900°F Wood-Fired Oven",
                description: "Our traditional Neapolitan oven blazes at 900°F, creating a signature leopard-spotted crust in just 90 seconds.",
                color: "fire-orange"
              },
              {
                icon: Soup,
                title: "Signature House Sauce",
                description: "Our herb-infused tomato sauce and fresh buffalo mozzarella are made in-house, the true Italian way.",
                color: "golden-cheese"
              },
              {
                icon: Croissant,
                title: "Slow-Fermented Dough",
                description: "Handcrafted dough, slow-fermented for over 48 hours with premium Italian '00' flour for a light, airy, and perfectly chewy crust.",
                color: "golden-cheese"
              },
              {
                icon: Salad,
                title: "Farm-Fresh Veggies",
                description: "Every bite bursts with the vibrant flavors of farm-picked, fresh vegetables—always crisp, always delicious.",
                color: "golden-cheese" // changed from "warm-amber" to "golden-cheese"
              },
              {
                icon: Pizza,
                title: "Iconic Leopard Crust",
                description: "Enjoy pillowy Neapolitan pizza with a smoky char and our signature leopard-spotted crust.",
                color: "golden-cheese"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: `0 25px 50px hsl(var(--${feature.color}))/30`
                }}
              >
                <Card className="bg-[hsl(var(--cream-white))]/10 backdrop-blur-sm h-full">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className={`w-20 h-20 rounded-full bg-[hsl(var(--${feature.color}))] flex items-center justify-center mx-auto mb-6`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Show icon for each specialty */}
                      <feature.icon className="w-10 h-10 text-[hsl(var(--charcoal-black))]" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[hsl(var(--cream-white))] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[hsl(var(--smoke-gray))] leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stylish action buttons after features */}
          <div className="mt-16 flex justify-center">
            <div
              className="
                grid 
                grid-cols-1 
                gap-4 
                w-full 
                max-w-xl
                sm:grid-cols-2 
                sm:grid-rows-2
              "
            >
              <Link href="/menu">
                <button
                  className="flex items-center gap-2 justify-center px-7 py-4 rounded-2xl bg-gradient-to-r from-[hsl(var(--fire-orange))] to-[hsl(var(--golden-cheese))] text-white font-bold shadow-xl hover:scale-105 hover:from-[hsl(var(--warm-amber))] hover:to-[hsl(var(--fire-orange))] transition-all duration-200 border-2 border-[hsl(var(--fire-orange))] w-full h-[80px] text-base md:text-lg"
                  style={{ letterSpacing: "0.01em" }}
                >
                  <FileText className="w-6 h-6" />
                  Explore Our Menu
                </button>
              </Link>
              <Link href="/gallery">
                <button
                  className="flex items-center gap-2 justify-center px-7 py-4 rounded-2xl bg-gradient-to-r from-[#e66465] to-[#9198e5] text-white font-bold shadow-xl hover:scale-105 hover:from-[#9198e5] hover:to-[#e66465] transition-all duration-200 border-2 border-[#e66465] w-full h-[80px] text-base md:text-lg"
                  style={{ letterSpacing: "0.01em" }}
                >
                  <Camera className="w-6 h-6" />
                  View Our Gallery
                </button>
              </Link>
              <a
                href="https://www.instagram.com/subakespune/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center px-7 py-4 rounded-2xl bg-gradient-to-r from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white font-bold shadow-xl hover:scale-105 hover:from-[#285AEB] hover:to-[#fd5949] transition-all duration-200 border-2 border-[#d6249f] w-full h-[80px] text-base md:text-lg"
                style={{ letterSpacing: "0.01em" }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
                </svg>
                Join us on Instagram
              </a>
              <a
                href="https://www.facebook.com/subakespune/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center px-7 py-4 rounded-2xl bg-gradient-to-r from-[#1877f3] to-[#42a5f5] text-white font-bold shadow-xl hover:scale-105 hover:from-[#42a5f5] hover:to-[#1877f3] transition-all duration-200 border-2 border-[#1877f3] w-full h-[80px] text-base md:text-lg"
                style={{ letterSpacing: "0.01em" }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 2.1h-3.2C9.6 2.1 8 3.7 8 6.2V8H5.5A.5.5 0 0 0 5 8.5v3a.5.5 0 0 0 .5.5H8v9a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-9h2.1a.5.5 0 0 0 .5-.5l.1-3a.5.5 0 0 0-.5-.5H12V6.2c0-.5.1-.7.7-.7H17a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"/>
                </svg>
                Like us on Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonial Section */}
      <section
        ref={testimonialRef}
        className="relative z-20 py-16 bg-gradient-to-br from-[hsl(var(--cream-white))]/10 to-[hsl(var(--wood-brown))]/10 border-b border-[hsl(var(--fire-orange))]/10"
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-[hsl(var(--fire-orange))] mb-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Happy Customers
          </motion.h2>
          {/* Testimonial Slideshow */}
          <TestimonialSlideshow />
        </div>
      </section>

      {/* Contact Form + Map Section */}
      <section
        ref={contactFormRef}
        className="relative z-20 py-16 bg-gradient-to-br from-[hsl(var(--wood-brown))]/10 to-[hsl(var(--cream-white))]/10 border-b border-[hsl(var(--fire-orange))]/10"
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-[hsl(var(--fire-orange))] mb-10 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Get in Touch
          </motion.h2>
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {/* Map */}
            <div className="md:w-1/2 w-full h-64 md:h-auto rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Subakes Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.493303407961!2d73.84811887519133!3d18.50659698258424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c142642bd53b%3A0x656cf44988268095!2sSuBakes%20-%20Wood%20Fired%20Pizzeria!5e0!3m2!1sen!2sin!4v1749385974086!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Contact Form */}
            <div className="md:w-1/2 w-full bg-[hsl(var(--cream-white))]/80 rounded-xl shadow-lg p-8 flex flex-col justify-center">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={visitRef}
        className="relative z-20 py-20 bg-gradient-to-r from-[hsl(var(--charcoal-black))] to-[hsl(var(--stone-gray))]"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-[hsl(var(--fire-orange))] mb-6">
              Visit Us in Pune
            </h2>
            <p className="text-xl text-[hsl(var(--cream-white))] max-w-3xl mx-auto">
              Experience the irresistible taste of wood-fired pizza—crafted with love, served with pride.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="bg-[hsl(var(--wood-brown))]/50 backdrop-blur-sm h-full">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[hsl(var(--fire-orange))] flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[hsl(var(--cream-white))] mb-4">
                    Our Address
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="https://www.google.com/maps/place/SuBakes+-+Wood+Fired+Pizzeria/@18.506597,73.8481189,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2c142642bd53b:0x656cf44988268095!8m2!3d18.506597!4d73.8506938!16s%2Fg%2F11n05c5gk1?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-lg font-semibold text-[hsl(var(--fire-orange))] hover:text-[hsl(var(--warm-amber))] transition cursor-pointer"
                      style={{ textDecoration: "none" }}
                    >
                      Shop No. 2 & 3, Chaitanya Apartment, 2063, near SIR PARASHURAMBHAU COLLEGE, Sadashiv Peth, Pune, Maharashtra 411030
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Open Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="bg-[hsl(var(--wood-brown))]/50 backdrop-blur-sm h-full">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[hsl(var(--fire-orange))] flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Clock className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[hsl(var(--cream-white))] mb-4">
                    Opening Hours
                  </h3>
                  <div className="space-y-2">
                    <p className="text-[hsl(var(--smoke-gray))]">Open All Week – Ready to Serve You!</p>
                    <p className="text-[hsl(var(--smoke-gray))]">11:30 AM – 11:00 PM</p>
                    <p className="text-[hsl(var(--smoke-gray))]">Breakfast: 11:30 AM – 6:00 PM</p>
                    <p className="text-[hsl(var(--smoke-gray))]">Dine-In: 11:30 AM – 11:00 PM</p>
                    <p className="text-[hsl(var(--smoke-gray))]">Delivery: 10:00 AM – 11:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Contact Us Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="bg-[hsl(var(--wood-brown))]/50 backdrop-blur-sm h-full">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[hsl(var(--fire-orange))] flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Phone className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[hsl(var(--cream-white))] mb-4">
                    Reach Out to Us
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="tel:09021549565"
                      className="block text-lg font-semibold text-[hsl(var(--fire-orange))] hover:text-[hsl(var(--warm-amber))] transition cursor-pointer"
                      style={{ textDecoration: "none" }}
                    >
                      090215 49565
                    </a>
                    <a
                      href="mailto:subakespatisserie@gmail.com"
                      className="block text-lg font-semibold text-[hsl(var(--fire-orange))] hover:text-[hsl(var(--warm-amber))] transition cursor-pointer"
                      style={{ textDecoration: "none" }}
                    >
                      subakespatisserie@gmail.com
                    </a>
                    <p className="text-[hsl(var(--smoke-gray))]">Reservations Welcome</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      

      {/* Floating Subakes FAB */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {showFabMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              // Premium FAB menu theme
              className="mb-3 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 border border-[hsl(var(--fire-orange))] bg-gradient-to-br from-white via-[hsl(var(--cream-white))] to-[hsl(var(--warm-amber))]/30 backdrop-blur-xl"
              style={{
                boxShadow: "0 8px 32px 0 rgba(255,140,0,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)"
              }}
            >
              {/* Home */}
              <button
                className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[hsl(var(--fire-orange))]/10 text-[hsl(var(--charcoal-black))] font-semibold text-lg transition"
                style={{ letterSpacing: "0.01em" }}
                onClick={() => {
                  setShowFabMenu(false);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                }}
              >
                <Pizza className="w-5 h-5 text-[hsl(var(--fire-orange))]" />
                Home
              </button>
              {/* Find Us on Maps */}
              <a
                href="https://www.google.com/maps/place/SuBakes+-+Wood+Fired+Pizzeria/@18.506597,73.8481189,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2c142642bd53b:0x656cf44988268095!8m2!3d18.506597!4d73.8506938!16s%2Fg%2F11n05c5gk1?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[hsl(var(--fire-orange))]/10 text-[hsl(var(--charcoal-black))] font-semibold text-lg transition"
                style={{ letterSpacing: "0.01em" }}
                onClick={() => setShowFabMenu(false)}
              >
                <MapPin className="w-5 h-5 text-[hsl(var(--fire-orange))]" />
                Find Us on Maps
              </a>
              {/* Leave a Review */}
              <a
                href="https://www.google.com/search?sca_esv=b81c990ea89a4bf5&rlz=1C1CHBF_enIN1130IN1130&sxsrf=AE3TifNgZXKEjlAhR5JqPvMWiluU-AoisA:1749404275618&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E_RMPjiykuKinGuj1TOgFyvnFGRtXdWh_VN8wsUb5cLgOhbsrxRjAl0AclH6gbBKJBRqnzUmXFQx5TvMyLYdwZkf9JiAIQtKuuUYaDW9CvK95C_Kpg%3D%3D&q=SuBakes+-+Wood+Fired+Pizzeria+Reviews&sa=X&ved=2ahUKEwj706rjruKNAxVZd2wGHRkuOuwQ0bkNegQIIRAD&biw=606&bih=663&dpr=1.38#lrd=0x3bc2c142642bd53b:0x656cf44988268095,3,,,,"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[hsl(var(--fire-orange))]/10 text-[hsl(var(--charcoal-black))] font-semibold text-lg transition"
                style={{ letterSpacing: "0.01em" }}
                onClick={() => setShowFabMenu(false)}
              >
                <CakeSlice className="w-5 h-5 text-[hsl(var(--fire-orange))]" />
                Leave a Review
              </a>
              {/* Call */}
              <a
                href="tel:09021549565"
                className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[hsl(var(--fire-orange))]/10 text-[hsl(var(--charcoal-black))] font-semibold text-lg transition"
                style={{ letterSpacing: "0.01em" }}
                onClick={() => setShowFabMenu(false)}
              >
                <Phone className="w-5 h-5 text-[hsl(var(--fire-orange))]" />
                Call 09021549565
              </a>
              {/* See Our Menu */}
              <Link href="/menu">
                <button
                  className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[hsl(var(--fire-orange))]/10 text-[hsl(var(--charcoal-black))] font-semibold text-lg transition"
                  style={{ letterSpacing: "0.01em" }}
                  onClick={() => setShowFabMenu(false)}
                >
                  <FileText className="w-5 h-5 text-[hsl(var(--fire-orange))]" />
                  See Our Menu
                </button>
              </Link>
              {/* Explore Our Gallery */}
              <Link href="/gallery">
                <button
                  className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[hsl(var(--fire-orange))]/10 text-[hsl(var(--charcoal-black))] font-semibold text-lg transition"
                  style={{ letterSpacing: "0.01em" }}
                  onClick={() => setShowFabMenu(false)}
                >
                  <Camera className="w-5 h-5 text-[hsl(var(--fire-orange))]" />
                  Explore Our Gallery
                </button>
              </Link>
              {/* Follow us on Instagram */}
              <a
                href="https://www.instagram.com/subakespune/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#f9e6d0]/60 text-[#e1306c] font-semibold text-lg transition"
                style={{ letterSpacing: "0.01em" }}
                onClick={() => setShowFabMenu(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
                </svg>
                Follow us on Instagram
              </a>
              {/* Follow us on Facebook */}
              <a
                href="https://www.facebook.com/subakespune/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#e6eaf9]/60 text-[#1877f3] font-semibold text-lg transition"
                style={{ letterSpacing: "0.01em" }}
                onClick={() => setShowFabMenu(false)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 2.1h-3.2C9.6 2.1 8 3.7 8 6.2V8H5.5A.5.5 0 0 0 5 8.5v3a.5.5 0 0 0 .5.5H8v9a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-9h2.1a.5.5 0 0 0 .5-.5l.1-3a.5.5 0 0 0-.5-.5H12V6.2c0-.5.1-.7.7-.7H17a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"/>
                </svg>
                Follow us on Facebook
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          className="w-16 h-16 flex items-center justify-center transition bg-transparent shadow-none border-none outline-none"
          style={{ background: "none", boxShadow: "none", border: "none" }}
          onClick={() => setShowFabMenu((v) => !v)}
          aria-label="Open Subakes menu"
        >
          <motion.img
            src="/images/057f1b6c-ec55-47d9-8275-cabf3479c3fe.jpg"
            alt="FAB"
            className="w-16 h-16 rounded-full object-cover"
            style={{
              pointerEvents: "none",
              background: "none",
              border: "none",
              boxShadow: "none"
            }}
            animate={{ rotate: fabRotation }}
            transition={{ type: "linear", ease: "linear", duration: 0 }}
            draggable={false}
          />
        </button>
      </div>
      {/* Footer */}
      <footer
    // ref={el => {
    //   // Remove buggy __footerRef logic
    //   // If you need a footer ref, use useRef instead
    // }}
    className="relative z-20 bg-[hsl(var(--charcoal-black))] text-[hsl(var(--cream-white))] py-12"
  >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <motion.div
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Pizza className="w-8 h-8 mr-3 text-[hsl(var(--fire-orange))]" />
              <h3 className="text-3xl font-bold">SuBakes – Wood Fired Pizzeria</h3>
              <Flame className="w-6 h-6 ml-3 text-[hsl(var(--fire-orange))]" />
            </motion.div>
            <p className="text-[hsl(var(--smoke-gray))] mb-6 text-lg font-script">
              Where every bite is a celebration of tradition and taste.
            </p>
            <p className="text-[hsl(var(--smoke-gray))] text-sm">
              © 2020 SuBakes – Wood Fired Pizzeria. All rights reserved. | Pune’s home for authentic wood-fired pizza.
            </p>
            <p className="text-[hsl(var(--smoke-gray))] text-xs">
        Website crafted with ❤️ by <span className="font-semibold">Chinmay M.</span> (
        <a
          href="https://github.com/Chinnmay77"
          className="underline hover:text-[hsl(var(--fire-orange))]"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        )
      </p>
          </div>
        </div>
      </footer>
    </div>
  );
}



// Add this component before the export default function Home()
function TestimonialSlideshow() {
  const testimonials = [
    {
      name: "Anup Joshi",
      review: "Very good experience. We ordered Garlic bread with Cheese and Mediterranean pizza. Both were very yummy. The garlic bread was especially outstanding.",
      source: "Google"
    },
    {
      name: "Ketki Mainkar",
      review: "Excellent food and service. I will recommend it to everyone to go there atleast once. Pizza and white sauce pasta varities are mouthwatering. Even I will suggest to go for a fully stuffed burger. Ambience gives you vibe of Italy and you will not feel that you are in Pune.",
      source: "Zomato"
    },
    {
      name: "Apurva Wadkar",
      review: "The quality and quantity of food is superb. Very nice hospitality. The vibe of the place was lit. I loved the carmel frappécino.",
      source: "Google"
    },
    {
      name: "Manasi Athavale",
      review: "Gone there several times, ordered several times ! Its such a cute little place in the Pune's Peth area,.. the taste is authentic! 🍕 are yummy and so are the 🍔.... you will visit again for the delicious food they serve. Service is slow. If you are in a hurry and want to grab a bite quickly, that's not possible here",
      source: "Zomato"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Name as heading */}
          <span className="text-xl md:text-2xl font-bold text-[hsl(var(--fire-orange))] mb-2">
            {testimonials[current].name}
          </span>
          <p className="text-xl md:text-2xl text-[hsl(var(--charcoal-black))] font-medium mb-2 max-w-2xl">
            “{testimonials[current].review}”
          </p>
          <span className="text-base text-[hsl(var(--smoke-gray))] italic">
            from {testimonials[current].source}
          </span>
        </motion.div>
      </AnimatePresence>
      {/* Slide indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${current === idx ? "bg-[hsl(var(--fire-orange))]" : "bg-[hsl(var(--smoke-gray))]/30"} transition`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Add this component before the export default function Home()
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
      setTimeout(() => setSubmitted(false), 2000);
    }, 1000);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        required
        placeholder="Your Name"
        className="px-4 py-3 rounded-lg border border-[hsl(var(--fire-orange))]/30 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--fire-orange))] bg-white"
        value={form.name}
        onChange={handleChange}
        disabled={loading || submitted}
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        className="px-4 py-3 rounded-lg border border-[hsl(var(--fire-orange))]/30 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--fire-orange))] bg-white"
        value={form.email}
        onChange={handleChange}
        disabled={loading || submitted}
      />
      <textarea
        name="message"
        required
        placeholder="Your Message"
        rows={5}
        className="px-4 py-3 rounded-lg border border-[hsl(var(--fire-orange))]/30 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--fire-orange))] bg-white resize-none"
        value={form.message}
        onChange={handleChange}
        disabled={loading || submitted}
      />
      <button
        type="submit"
        className="bg-[hsl(var(--fire-orange))] hover:bg-[hsl(var(--warm-amber))] text-white font-bold py-3 rounded-lg transition"
        disabled={loading || submitted}
      >
        {loading ? "Sending..." : submitted ? "Thank you for contacting us!" : "Send Message"}
      </button>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </form>
  );
}
