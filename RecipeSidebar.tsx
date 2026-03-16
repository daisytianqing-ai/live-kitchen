import { motion } from 'motion/react';
import { Recipe } from '../types';
import { ScrollText, Utensils, ListChecks } from 'lucide-react';

interface RecipeSidebarProps {
  recipe: Recipe | null;
}

export function RecipeSidebar({ recipe }: RecipeSidebarProps) {
  if (!recipe) {
    return (
      <div className="w-80 h-full bg-morandi-paper/30 border-l border-morandi-border flex flex-col items-center justify-center p-8 text-center gap-4">
        <ScrollText className="text-morandi-muted" size={48} strokeWidth={1} />
        <p className="text-morandi-muted font-serif italic">
          Tell the Sous-Chef what you'd like to cook to see the recipe overview.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 h-full bg-morandi-paper/50 border-l border-morandi-border flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-morandi-border bg-white/20">
        <h2 className="text-2xl font-serif font-bold text-morandi-ink leading-tight mb-2">
          {recipe.name}
        </h2>
        <p className="text-sm text-morandi-muted italic leading-relaxed">
          {recipe.description}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 text-morandi-ochre">
            <Utensils size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Ingredients</h3>
          </div>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="text-sm text-morandi-ink flex gap-2">
                <span className="text-morandi-ochre">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-morandi-ochre">
            <ListChecks size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Full Steps</h3>
          </div>
          <ol className="space-y-4">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-morandi-ochre/20 text-morandi-ochre text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <p className="text-sm text-morandi-ink leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </motion.div>
  );
}
