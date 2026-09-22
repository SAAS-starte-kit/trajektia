import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: 'solid' | 'outline' | 'ghost';
}

export default function ShareButton({ 
  title, 
  text = "Découvrez cet outil sur Trajektia", 
  url, 
  className = "",
  variant = 'outline'
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all outline-none focus:ring-2 focus:ring-brand-blue/50";
  
  const variants = {
    solid: "bg-brand-blue text-white shadow-md shadow-brand-blue/20 hover:opacity-90",
    outline: "bg-slate-800/50 ring-1 ring-slate-700 text-slate-200 hover:bg-gray-50",
    ghost: "text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10"
  };

  return (
    <button 
      onClick={handleShare}
      title="Partager cette page"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
      {copied ? "Lien copié !" : "Partager"}
    </button>
  );
}
