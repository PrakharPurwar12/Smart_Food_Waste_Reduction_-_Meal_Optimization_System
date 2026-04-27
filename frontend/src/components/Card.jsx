import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, title, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="font-semibold text-lg text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
