import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1c1c1e_0%,_#000000_100%)]" />
      
      {/* Aurora Orbs */}
      <div className="absolute -top-[20%] left-[20%] w-[60vw] h-[60vw] bg-blue-600 rounded-full blur-[120px] opacity-40 animate-float" />
      <div className="absolute -bottom-[20%] right-[20%] w-[70vw] h-[70vw] bg-indigo-600 rounded-full blur-[120px] opacity-40 animate-float [animation-delay:-5s]" />
      
      {/* Grain overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
    </div>
  );
};

export default Background;