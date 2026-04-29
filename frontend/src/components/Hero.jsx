import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const Hero = ({ onAdminTrigger }) => {
  return (
    <div className="relative w-full h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Left Content (Text) */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-full flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24 relative z-10 pt-24 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-8">
            <span className="w-8 h-[2px] bg-gray-900"></span>
            <span className="uppercase tracking-widest text-xs font-bold text-gray-600">The New Standard</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-6">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Everyday.</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-md mb-10 leading-relaxed font-medium">
            Curated fashion and timeless accessories for the modern wardrobe. Quality over quantity, style without compromise.
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gray-900 text-white px-8 py-4 rounded-none font-bold tracking-wider uppercase text-sm flex items-center gap-3 w-fit hover:bg-black transition-colors shadow-xl"
          >
            Explore Collection
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src={`/avatar${i}.png`} alt={`Customer ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs font-bold text-gray-900 mt-1">Loved by 10,000+ customers</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Image */}
      <div className="relative w-full h-[40vh] md:h-full md:w-1/2 overflow-hidden">
        <img 
          src="/hero_sneakers.png" 
          alt="Premium Fashion" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent"></div>
        
        {/* Floating Card on Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 md:bottom-16 right-8 bg-white/95 backdrop-blur-md p-6 shadow-2xl max-w-[260px] hidden sm:block"
        >
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Featured</p>
          <p className="font-bold text-gray-900 text-lg leading-tight mb-2">Minimalist Wardrobe Essentials</p>
          <div className="w-full h-1 bg-gray-900 mt-4"></div>
        </motion.div>
      </div>

      {/* Logo Overlay */}
      <div className="absolute top-6 left-6 md:top-8 md:left-16 lg:left-24 z-20">
        <span 
          onDoubleClick={onAdminTrigger}
          className="text-2xl font-black tracking-tighter text-gray-900 cursor-default select-none"
        >
          LUMIÈRE
        </span>
      </div>

    </div>
  );
};

export default Hero;
